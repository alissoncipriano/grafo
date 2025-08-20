import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import TuneIcon from '@mui/icons-material/Tune';

export type LabelType = 'simples' | 'detalhado';

interface GraphActionsProps {
  toggleExpand: () => void;
  isExpanded: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
  labelType: LabelType;
  onLabelTypeChange: (newType: LabelType) => void;
  visibleLevel: number;
  onLevelChange: (newLevel: number) => void;
}

const GraphActions = ({
  toggleExpand,
  isExpanded,
  onZoomIn,
  onZoomOut,
  onCenter,
  labelType,
  onLabelTypeChange,
  visibleLevel,
  onLevelChange,
}: GraphActionsProps) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleLabelChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: LabelType | null
  ) => {
    if (newType !== null) {
      onLabelTypeChange(newType);
      setIsPanelOpen(false);
    }
  };

  const handleLevelChangeAdapter = (
    event: React.MouseEvent<HTMLElement>,
    newLevel: number | null
  ) => {
    if (newLevel !== null) {
      onLevelChange(newLevel);
      setIsPanelOpen(false);
    }
  };

  return (
    <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
      <Stack
        direction='row'
        spacing={1}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          alignItems: 'center',
        }}
      >
        <Stack direction='column' spacing={0}>
          <Tooltip title={isExpanded ? 'Restaurar' : 'Tela Cheia'}>
            <IconButton
              onClick={toggleExpand}
              size='small'
              aria-label='toggle fullscreen'
            >
              {isExpanded ? (
                <FullscreenExitIcon fontSize='small' />
              ) : (
                <FullscreenIcon fontSize='small' />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title='Aumentar Zoom'>
            <IconButton onClick={onZoomIn} size='small' aria-label='zoom in'>
              <ZoomInIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Diminuir Zoom'>
            <IconButton onClick={onZoomOut} size='small' aria-label='zoom out'>
              <ZoomOutIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Centralizar Grafo'>
            <IconButton
              onClick={onCenter}
              size='small'
              aria-label='center graph'
            >
              <FilterCenterFocusIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Stack>
        <Divider orientation='vertical' flexItem />
        <Tooltip title='Filtros'>
          <IconButton onClick={() => setIsPanelOpen(!isPanelOpen)} size='small'>
            <TuneIcon color='action' />
          </IconButton>
        </Tooltip>
        <AnimatePresence>
          {isPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0, marginRight: 0 }}
              animate={{ width: 'auto', opacity: 1, marginRight: 8 }}
              exit={{ width: 0, opacity: 0, marginRight: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden', display: 'flex' }}
            >
              <Stack
                direction='row'
                spacing={2}
                sx={{ alignItems: 'center', paddingLeft: 1 }}
              >
                <Stack>
                  <Typography
                    variant='caption'
                    sx={{ mb: 0.5, textAlign: 'center' }}
                  >
                    Visualização
                  </Typography>
                  <ToggleButtonGroup
                    value={labelType}
                    exclusive
                    onChange={handleLabelChange}
                    size='small'
                  >
                    <ToggleButton value='simples'>Simples</ToggleButton>
                    <ToggleButton value='detalhado'>Detalhado</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
                <Stack>
                  <Typography
                    variant='caption'
                    sx={{ mb: 0.5, textAlign: 'center' }}
                  >
                    Níveis
                  </Typography>
                  <ToggleButtonGroup
                    value={visibleLevel}
                    exclusive
                    onChange={handleLevelChangeAdapter}
                    size='small'
                  >
                    <ToggleButton value={1}>1</ToggleButton>
                    <ToggleButton value={2}>2</ToggleButton>
                    <ToggleButton value={3}>3</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </Box>
  );
};
export default GraphActions;
