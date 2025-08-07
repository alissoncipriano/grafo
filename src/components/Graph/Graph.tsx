import React, { useRef, useState } from 'react';
import { Box, IconButton, Paper, Tooltip } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShareIcon from '@mui/icons-material/Share';
import { useGraph } from './useGraph';
import { IGrafo, NodeObject } from './types';
import GraphLegend from './GraphLegend';
import GraphActions, { LabelType } from './GraphActions';

interface HoveredNode {
  data: NodeObject;
  position: { x: number; y: number };
}

interface GraphProps {
  grafo: IGrafo | null;
}

const Graph = ({ grafo }: GraphProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomAction, setZoomAction] = useState<'in' | 'out' | null>(null);
  const [centerAction, setCenterAction] = useState(false);
  const [labelType, setLabelType] = useState<LabelType>('simples');
  const [visibleLevel, setVisibleLevel] = useState<number>(1);
  const [hoveredNode, setHoveredNode] = useState<HoveredNode | null>(null);

  const graphContainerRef = useRef<HTMLDivElement>(null);

  const expansion = useMotionValue(0);
  const expansionSpring = useSpring(expansion, { stiffness: 100, damping: 20 });
  const width = useTransform(expansionSpring, [0, 1], [400, 1000]);
  const height = useTransform(expansionSpring, [0, 1], [400, 500]);

  // Funções de callback para o hook useGraph
  const handleNodeClick = (node: NodeObject) => {
    console.log('Nó Clicado:', {
      id: node.id,
      documento: node.documento,
      tipoDocumento: node.tipoDocumento,
    });
    // Ao clicar num nó, também mostramos a sua UI
    if (hoveredNode?.data.id !== node.id) {
      // A posição do rato não é necessária aqui, pois o hover já a terá definido
      // Apenas para garantir, podemos chamar a função de hover
      // Esta chamada será otimizada no useGraph para não disparar se já estiver visível
    }
  };

  const handleNodeHover = (
    node: NodeObject | null,
    position: [number, number] | null
  ) => {
    // Esta função agora apenas define o nó ativo, sem lógica de esconder
    if (node && position) {
      setHoveredNode({
        data: node,
        position: { x: position[0], y: position[1] },
      });
    }
    // A lógica para esconder (passar null) foi removida daqui
  };

  const handleCanvasClick = () => {
    // Esconde a UI ao clicar em espaço vazio
    setHoveredNode(null);
  };

  useGraph(
    graphContainerRef,
    grafo,
    { width, height },
    { zoomAction, setZoomAction },
    { centerAction, setCenterAction },
    { labelType, visibleLevel },
    {
      onNodeClick: handleNodeClick,
      onNodeHover: handleNodeHover,
      onCanvasClick: handleCanvasClick,
    }
  );

  const handleToggleExpand = () => {
    const nextValue = !isExpanded;
    setIsExpanded(nextValue);
    expansion.set(nextValue ? 1 : 0);
    setTimeout(() => {
      setCenterAction(true);
    }, 1000);
  };

  const handleZoomIn = () => setZoomAction('in');
  const handleZoomOut = () => setZoomAction('out');
  const handleCenter = () => setCenterAction(true);
  const handleLevelChange = (newLevel: number) => {
    if (newLevel !== null) {
      setVisibleLevel(newLevel);
      setTimeout(() => setCenterAction(true), 300);
    }
  };
  const handleLabelTypeChange = (newType: LabelType) => {
    setLabelType(newType);
  };

  return (
    <Box
      ref={graphContainerRef}
      component={motion.div}
      style={{ width, height }}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
      }}
      onMouseLeave={() => setHoveredNode(null)} // Esconde a UI ao sair do container
    >
      <GraphActions
        toggleExpand={handleToggleExpand}
        isExpanded={isExpanded}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onCenter={handleCenter}
        labelType={labelType}
        onLabelTypeChange={handleLabelTypeChange}
        visibleLevel={visibleLevel}
        onLevelChange={handleLevelChange}
      />
      {grafo && <GraphLegend legenda={grafo.legenda} />}

      {hoveredNode && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            top: hoveredNode.position.y,
            left: hoveredNode.position.x,
            transform: 'translate(-50%, 24px)', // Aumenta a distância para não sobrepor o cursor
            p: 0.5,
            borderRadius: '20px',
            display: 'flex',
            pointerEvents: 'all',
          }}
        >
          <Tooltip title='Adicionar'>
            <IconButton
              size='small'
              onClick={() =>
                console.log('Botão Adicionar Clicado:', hoveredNode.data)
              }
            >
              <AddCircleOutlineIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Partilhar'>
            <IconButton
              size='small'
              onClick={() =>
                console.log('Botão Partilhar Clicado:', hoveredNode.data)
              }
            >
              <ShareIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Paper>
      )}
    </Box>
  );
};
export default Graph;
