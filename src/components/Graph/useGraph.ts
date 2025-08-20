/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MotionValue } from 'framer-motion';
import { IGrafo, NodeObject, LinkObject, TipoDocumento } from './types';
import { LabelType } from './GraphActions';
import { nodeSVGTemplates } from './nodeSVGs';
import { drawGraph, findNodeAt, calculateBounds } from './utils'; // Funções agora importadas

// Define a estrutura das opções de filtro recebidas como prop
interface FilterOptions {
  labelType: LabelType;
  visibleLevel: number;
}

// Define a estrutura das funções de callback para interações
interface InteractionOptions {
  onNodeClick: (node: NodeObject) => void;
  onNodeHover: (
    node: NodeObject | null,
    position: [number, number] | null
  ) => void;
  onCanvasClick: () => void;
}

/**
 * Hook customizado para renderizar e gerir um grafo interativo com D3.js e Canvas.
 * @param containerRef Ref para o elemento div que irá conter o canvas.
 * @param grafo Dados do grafo a serem renderizados.
 * @param dimensions MotionValues para largura e altura, permitindo animações.
 * @param zoomControl Controle para acionar o zoom a partir de botões externos.
 * @param centerControl Controle para acionar a centralização a partir de um botão externo.
 * @param filters Opções de filtro para os nós e rótulos.
 * @param interactions Funções de callback para eventos de interação do usuário.
 */
export const useGraph = (
  containerRef: React.RefObject<HTMLDivElement>,
  grafo: IGrafo | null,
  dimensions: { width: MotionValue<number>; height: MotionValue<number> },
  zoomControl: {
    zoomAction: 'in' | 'out' | null;
    setZoomAction: React.Dispatch<React.SetStateAction<'in' | 'out' | null>>;
  },
  centerControl: {
    centerAction: boolean;
    setCenterAction: React.Dispatch<React.SetStateAction<boolean>>;
  },
  filters: FilterOptions,
  interactions: InteractionOptions
) => {
  // Refs para manter o estado do D3 e outros valores entre renderizações sem causar re-renderizações desnecessárias.
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<HTMLCanvasElement, unknown>>();
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const simulationRef = useRef<d3.Simulation<NodeObject, LinkObject>>();
  const masterNodesRef = useRef<Map<string, NodeObject>>(new Map()); // Armazena todos os nós e as suas posições
  const currentDataRef = useRef<{
    nodes: NodeObject[];
    links: LinkObject[];
    colorMap: Map<string, string>;
  }>();
  const filtersRef = useRef(filters); // Armazena a referência mais recente dos filtros
  const lastHoveredNodeId = useRef<string | null>(null);
  const isDraggingRef = useRef(false); // Flag para controlar se um nó está sendo arrastado

  // Estado para garantir que os SVGs sejam pré-carregados antes do primeiro desenho
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const svgImageCache = useRef<Map<TipoDocumento, HTMLImageElement>>(new Map());

  /**
   * Efeito para manter a ref dos filtros sempre atualizada.
   * Crucial para que a função draw, definida uma única vez, possa acessar os filtros mais recentes.
   */
  useEffect(() => {
    filtersRef.current = filters;
    simulationRef.current?.tick(); // Força um redesenho para aplicar mudanças de estilo imediatamente
  }, [filters]);

  /**
   * Efeito para pré-carregar os SVGs dos nós como imagens.
   * Melhora significativamente o desempenho, pois o browser não precisa de re-parsear o SVG a cada frame.
   */
  useEffect(() => {
    if (!grafo) return;

    const imagePromises: Promise<void>[] = [];
    setImagesLoaded(false);

    grafo.legenda.forEach((legendaItem) => {
      const tipo = legendaItem.tipoDocumento as TipoDocumento;

      if (nodeSVGTemplates[tipo]) {
        const promise = new Promise<void>((resolve) => {
          const svgString = nodeSVGTemplates[tipo]
            .replace(/{COLOR}/g, legendaItem.cor)
            .replace(/{COLOR_CLARA}/g, legendaItem.corClara);

          const img = new Image();

          img.src = `data:image/svg+xml;base64,${btoa(
            unescape(encodeURIComponent(svgString))
          )}`;
          img.onload = () => {
            svgImageCache.current.set(tipo, img);
            resolve();
          };
          img.onerror = () => {
            console.error(
              `Falha ao carregar a imagem SVG para o tipo: ${tipo}`
            );
            resolve();
          };
        });

        imagePromises.push(promise);
      }
    });

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, [grafo]);

  /**
   * Efeito para a funcionalidade de centralizar o grafo.
   * Utiliza a função "calculateBounds" de utils.tsx para obter a "caixa" que envolve todos os nós visíveis
   * e depois ajusta o zoom/pan para a enquadrar no centro do canvas.
   */
  useEffect(() => {
    if (
      !centerControl.centerAction ||
      !canvasRef.current ||
      !zoomRef.current ||
      !simulationRef.current
    )
      return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const zoomBehavior = zoomRef.current;
    const nodes = simulationRef.current.nodes();
    const { width, height } = canvas.getBoundingClientRect();

    if (nodes.length === 0 || !context) {
      centerControl.setCenterAction(false);
      return;
    }

    const bounds = calculateBounds(
      nodes,
      filtersRef.current.labelType,
      context
    );

    if (!bounds) return;

    const { minX, maxX, minY, maxY } = bounds;
    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;

    const scale = Math.min(width / graphWidth, height / graphHeight) * 0.9;

    const translateX = width / 2 - (scale * (minX + maxX)) / 2;
    const translateY = height / 2 - (scale * (minY + maxY)) / 2;

    const newTransform = d3.zoomIdentity
      .translate(translateX, translateY)
      .scale(scale);

    d3.select(canvas)
      .transition()
      .duration(750)
      .call(zoomBehavior.transform, newTransform);

    centerControl.setCenterAction(false);
  }, [centerControl.centerAction]);

  /**
   * Efeito para acionar o zoom a partir dos botões de controle.
   */
  useEffect(() => {
    if (!zoomControl.zoomAction || !canvasRef.current || !zoomRef.current)
      return;

    const canvasSelection = d3.select(canvasRef.current);
    const zoomBehavior = zoomRef.current;
    const transition = canvasSelection.transition().duration(250);

    if (zoomControl.zoomAction === 'in') zoomBehavior.scaleBy(transition, 1.3);
    else if (zoomControl.zoomAction === 'out')
      zoomBehavior.scaleBy(transition, 1 / 1.3);

    zoomControl.setZoomAction(null);
  }, [zoomControl.zoomAction]);

  /**
   * Efeito de Setup: ocorre apenas uma vez na montagem do componente.
   * Responsável por criar o canvas, a simulação de física do D3 e configurar todos os listeners de eventos.
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const canvas = d3.select(container).append('canvas').node();

    if (!canvas) return;

    canvasRef.current = canvas;
    const context = canvas.getContext('2d');

    if (!context) return;

    const draw = () => {
      if (!context || !currentDataRef.current) return;

      drawGraph(
        context,
        transformRef.current,
        currentDataRef.current,
        filtersRef.current,
        svgImageCache.current
      );
    };

    // Cria a simulação de física dos nós
    const simulation = d3
      .forceSimulation<NodeObject, LinkObject>()
      .force(
        'link',
        d3.forceLink<NodeObject, LinkObject>().id((d) => d.id)
      )
      .force('charge', d3.forceManyBody())
      .on('tick', draw);

    simulationRef.current = simulation;

    // Configura o comportamento de zoom e pan
    const zoomBehavior = d3
      .zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.1, 8])
      .filter((event) => {
        if (event.type === 'wheel') return true;

        const { x, y, k } = transformRef.current;
        const pointerX = (event.offsetX - x) / k;
        const pointerY = (event.offsetY - y) / k;
        const noNodeFound = !findNodeAt(
          currentDataRef.current?.nodes || [],
          pointerX,
          pointerY
        );

        return !event.button && noNodeFound;
      })
      .on('start', () => {
        interactions.onCanvasClick();
      })
      .on('zoom', (event) => {
        transformRef.current = event.transform;
        draw();
      });

    zoomRef.current = zoomBehavior;
    d3.select(canvas).call(zoomBehavior);

    /**
     * Função para atualizar o tamanho do canvas e o centro da simulação.
     * Chamada na inicialização e sempre que as dimensões animadas do container mudam.
     */
    const updateCanvasAndSimulation = (w: number, h: number) => {
      if (!canvas || !context || !simulation) return;

      canvas.width = w;
      canvas.height = h;
      simulation.force('center', d3.forceCenter(w / 2, h / 2));
      simulation.alpha(0.3).restart();
    };

    updateCanvasAndSimulation(dimensions.width.get(), dimensions.height.get());

    const unsubscribeWidth = dimensions.width.onChange((w) =>
      updateCanvasAndSimulation(w, dimensions.height.get())
    );
    const unsubscribeHeight = dimensions.height.onChange((h) =>
      updateCanvasAndSimulation(dimensions.width.get(), h)
    );

    // Configura os listeners de eventos do mouse no canvas
    d3.select(canvas).on('click', (event) => {
      if (isDraggingRef.current) return;

      const { x, y, k } = transformRef.current;
      const pointerX = (event.offsetX - x) / k;
      const pointerY = (event.offsetY - y) / k;
      const node = findNodeAt(
        currentDataRef.current?.nodes || [],
        pointerX,
        pointerY
      );

      if (node) interactions.onNodeClick(node);
      else interactions.onCanvasClick();
    });

    d3.select(canvas).on('mousemove', (event) => {
      if (isDraggingRef.current) return;

      const { x, y, k } = transformRef.current;
      const pointerX = (event.offsetX - x) / k;
      const pointerY = (event.offsetY - y) / k;
      const node = findNodeAt(
        currentDataRef.current?.nodes || [],
        pointerX,
        pointerY
      );

      if (node) {
        d3.select(event.currentTarget).style('cursor', 'pointer');

        if (lastHoveredNodeId.current !== node.id) {
          const screenPos = transformRef.current.apply([node.x!, node.y!]);

          interactions.onNodeHover(node, screenPos);
          lastHoveredNodeId.current = node.id;
        }
      } else {
        d3.select(event.currentTarget).style('cursor', 'grab');
        lastHoveredNodeId.current = null;
      }
    });

    // Configura o comportamento de arrastar nós
    d3.select(canvas).call(
      d3
        .drag<HTMLCanvasElement, NodeObject, NodeObject | null>()
        .container(canvas)
        .subject((event) => {
          const { x, y, k } = transformRef.current;
          const pointerX = (event.x - x) / k;
          const pointerY = (event.y - y) / k;

          return (
            findNodeAt(
              currentDataRef.current?.nodes || [],
              pointerX,
              pointerY
            ) || null
          );
        })
        .on('start', (event) => {
          if (!event.subject) return;

          isDraggingRef.current = true;
          interactions.onNodeHover(null, null);

          if (!event.active) simulation.alphaTarget(0.3).restart();

          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
          d3.select(event.sourceEvent.target).style('cursor', 'grabbing');
          interactions.onCanvasClick();
        })
        .on('drag', (event) => {
          if (!event.subject) return;

          const { k } = transformRef.current;
          event.subject.fx! += event.dx / k;
          event.subject.fy! += event.dy / k;
        })
        .on('end', (event) => {
          if (!event.subject) return;

          isDraggingRef.current = false;

          if (!event.active) simulation.alphaTarget(0);

          event.subject.fx = null;
          event.subject.fy = null;
          d3.select(event.sourceEvent.target).style('cursor', 'grab');
        }) as any
    );

    return () => {
      unsubscribeWidth();
      unsubscribeHeight();
      simulation.stop();
      d3.select(container).select('canvas').remove();
    };
  }, []);

  /**
   * Efeito de Dados: reage a mudanças nos dados do grafo ou nos filtros.
   * Filtra os dados e atualiza a simulação existente sem a recriar.
   */
  useEffect(() => {
    if (!grafo || !simulationRef.current || !imagesLoaded) return;

    const simulation = simulationRef.current;

    grafo.nos.forEach((nodeData) => {
      if (masterNodesRef.current.has(nodeData.id)) {
        const existingNode = masterNodesRef.current.get(nodeData.id)!;
        Object.assign(existingNode, nodeData);
      } else masterNodesRef.current.set(nodeData.id, { ...nodeData });
    });

    const filteredLinks = grafo.relacionamentos.filter(
      (link) => link.nivel <= filters.visibleLevel
    );
    const visibleNodeIds = new Set(
      filteredLinks.flatMap((link) => [link.origem, link.alvo])
    );
    const centralNode = grafo.nos.find((n) => n.tipoDocumento === 'C');

    if (centralNode) visibleNodeIds.add(centralNode.id);

    const visibleNodes = Array.from(visibleNodeIds)
      .map((id) => masterNodesRef.current.get(id))
      .filter((node): node is NodeObject => !!node);

    currentDataRef.current = {
      nodes: visibleNodes,
      links: filteredLinks.map((r) => ({
        ...r,
        source: r.origem,
        target: r.alvo,
      })),
      colorMap: new Map(grafo.legenda.map((l) => [l.tipoDocumento, l.cor])),
    };

    const linkForce =
      simulation.force<d3.ForceLink<NodeObject, LinkObject>>('link');
    const chargeForce =
      simulation.force<d3.ForceManyBody<NodeObject>>('charge');

    if (filters.labelType === 'detalhado') {
      linkForce?.distance(180).strength(0.5);
      chargeForce?.strength(-800);
    } else {
      linkForce?.distance(100).strength(0.4);
      chargeForce?.strength(-400);
    }

    simulation.nodes(currentDataRef.current.nodes);

    if (linkForce) linkForce.links(currentDataRef.current.links);

    simulation.alpha(1).restart();
  }, [grafo, filters.labelType, filters.visibleLevel, imagesLoaded]);
};
