import * as d3 from 'd3';
import { NodeObject, LinkObject, TipoDocumento } from './types';
import { LabelType } from './GraphActions';

// --- Funções de Desenho
/**
 * Desenha os relacionamentos (arestas/linhas) no canvas.
 */
const drawLinks = (context: CanvasRenderingContext2D, links: LinkObject[]) => {
  context.strokeStyle = '#aaa';
  context.lineWidth = 1;

  context.beginPath();

  links.forEach((link) => {
    const source = link.source as NodeObject;
    const target = link.target as NodeObject;

    context.moveTo(source.x!, source.y!);
    context.lineTo(target.x!, target.y!);
  });

  context.stroke();
};

/**
 * Desenha os rótulos dos relacionamentos com fundo arredondado.
 */
const drawLinkLabels = (
  context: CanvasRenderingContext2D,
  links: LinkObject[]
) => {
  const linkFontSize = 8;

  context.font = `italic ${linkFontSize}px sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  links.forEach((link) => {
    const source = link.source as NodeObject;
    const target = link.target as NodeObject;

    if (!source.x || !source.y || !target.x || !target.y) return;

    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    const angle = Math.atan2(target.y - source.y, target.x - source.x);

    context.save();
    context.translate(midX, midY);
    context.rotate(angle);

    if (Math.abs(angle) > Math.PI / 2) context.rotate(Math.PI);

    const text = link.descricao;
    const textWidth = context.measureText(text).width;
    const paddingX = 4;
    const paddingY = 2;
    const rectWidth = textWidth + paddingX * 2;
    const rectHeight = linkFontSize + paddingY * 2;
    const rectX = -rectWidth / 2;
    const rectY = -rectHeight / 2;
    const cornerRadius = 3;

    context.fillStyle = 'rgba(0, 0, 0, 0.6)';

    context.beginPath();
    context.moveTo(rectX + cornerRadius, rectY);
    context.arcTo(
      rectX + rectWidth,
      rectY,
      rectX + rectWidth,
      rectY + rectHeight,
      cornerRadius
    );
    context.arcTo(
      rectX + rectWidth,
      rectY + rectHeight,
      rectX,
      rectY + rectHeight,
      cornerRadius
    );
    context.arcTo(rectX, rectY + rectHeight, rectX, rectY, cornerRadius);
    context.arcTo(rectX, rectY, rectX + rectWidth, rectY, cornerRadius);
    context.closePath();
    context.fill();

    context.fillStyle = '#FFF';
    context.fillText(text, 0, 0);
    context.restore();
  });
};

/**
 * Desenha os nós no canvas, alternando entre os modos 'simples' e 'detalhado'.
 */
const drawNodes = (
  context: CanvasRenderingContext2D,
  nodes: NodeObject[],
  labelType: LabelType,
  colorMap: Map<string, string>,
  svgImageCache: Map<TipoDocumento, HTMLImageElement>
) => {
  if (labelType === 'simples') {
    nodes.forEach((node) => {
      const img = svgImageCache.get(node.tipoDocumento);

      if (img) {
        const size = node.tipoDocumento === 'PF' ? 18 : 24;

        context.drawImage(
          img,
          node.x! - size / 2,
          node.y! - size / 2,
          size,
          size
        );
      }
    });

    const nodeFontSize = 9;

    context.font = `${nodeFontSize}px sans-serif`;
    context.fillStyle = '#333';
    context.textAlign = 'center';
    context.textBaseline = 'top';

    nodes.forEach((node) => {
      context.fillText(node.documento, node.x!, node.y! + 12);
    });
  } else {
    nodes.forEach((node) => {
      const padding = 8;
      const fontSize = 10;

      context.font = `bold ${fontSize}px sans-serif`;
      const textWidth = context.measureText(node.documento).width;
      const rectWidth = textWidth + padding * 2;
      const rectHeight = fontSize + padding * 2;
      const rectX = node.x! - rectWidth / 2;
      const rectY = node.y! - rectHeight / 2;
      const cornerRadius = 5;
      context.fillStyle = colorMap.get(node.tipoDocumento) || '#ccc';
      context.beginPath();
      context.moveTo(rectX + cornerRadius, rectY);
      context.arcTo(
        rectX + rectWidth,
        rectY,
        rectX + rectWidth,
        rectY + rectHeight,
        cornerRadius
      );
      context.arcTo(
        rectX + rectWidth,
        rectY + rectHeight,
        rectX,
        rectY + rectHeight,
        cornerRadius
      );
      context.arcTo(rectX, rectY + rectHeight, rectX, rectY, cornerRadius);
      context.arcTo(rectX, rectY, rectX + rectWidth, rectY, cornerRadius);
      context.closePath();
      context.fill();
      context.fillStyle = '#fff';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(node.documento, node.x!, node.y!);
    });
  }
};

/**
 * Função principal de desenho que gerencia a renderização de todos os elementos do grafo.
 */
export const drawGraph = (
  context: CanvasRenderingContext2D,
  transform: d3.ZoomTransform,
  data: {
    nodes: NodeObject[];
    links: LinkObject[];
    colorMap: Map<string, string>;
  },
  filters: { labelType: LabelType },
  svgImageCache: Map<TipoDocumento, HTMLImageElement>
) => {
  context.save();
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.translate(transform.x, transform.y);
  context.scale(transform.k, transform.k);

  drawLinks(context, data.links);
  drawLinkLabels(context, data.links);
  drawNodes(
    context,
    data.nodes,
    filters.labelType,
    data.colorMap,
    svgImageCache
  );

  context.restore();
};

// --- Funções de lógica e cálculo

/**
 * Encontra um nó numa determinada coordenada do "mundo" do grafo.
 */
export const findNodeAt = (
  nodes: NodeObject[],
  x: number,
  y: number
): NodeObject | null => {
  const radius = 15;
  const rSq = radius * radius;

  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];

    if (!node.x || !node.y) continue;

    const dx = x - node.x;
    const dy = y - node.y;

    if (dx * dx + dy * dy < rSq) return node;
  }
  return null;
};

/**
 * Calcula a "caixa" (bounding box) que envolve todos os nós visíveis,
 * considerando o tamanho real dos seus elementos visuais (ícones, rótulos, retângulos).
 */
export const calculateBounds = (
  nodes: NodeObject[],
  labelType: LabelType,
  context: CanvasRenderingContext2D
) => {
  if (nodes.length === 0) return null;

  let minX: number, maxX: number, minY: number, maxY: number;

  if (labelType === 'detalhado') {
    const nodeBounds = nodes.map((node) => {
      const padding = 8;
      const fontSize = 10;
      context.font = `bold ${fontSize}px sans-serif`;
      const textWidth = context.measureText(node.documento).width;
      const rectWidth = textWidth + padding * 2;
      const rectHeight = fontSize + padding * 2;

      return {
        minX: node.x! - rectWidth / 2,
        maxX: node.x! + rectWidth / 2,
        minY: node.y! - rectHeight / 2,
        maxY: node.y! + rectHeight / 2,
      };
    });

    minX = d3.min(nodeBounds, (b) => b.minX)!;
    maxX = d3.max(nodeBounds, (b) => b.maxX)!;
    minY = d3.min(nodeBounds, (b) => b.minY)!;
    maxY = d3.max(nodeBounds, (b) => b.maxY)!;
  } else {
    const iconRadius = 12;
    const labelHeight = 12;
    minX = d3.min(nodes, (node) => node.x! - iconRadius)!;
    maxX = d3.max(nodes, (node) => node.x! + iconRadius)!;
    minY = d3.min(nodes, (node) => node.y! - iconRadius)!;
    maxY = d3.max(nodes, (node) => node.y! + iconRadius + labelHeight)!;
  }

  return { minX, maxX, minY, maxY };
};
