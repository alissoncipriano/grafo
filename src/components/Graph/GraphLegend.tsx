import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { ILegenda } from './types';

interface GraphLegendProps {
  legenda: ILegenda[];
}

const GraphLegend = ({ legenda }: GraphLegendProps) => {
  if (!legenda || legenda.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '200px',
      }}
    >
      <Typography variant='subtitle2' gutterBottom>
        Legenda
      </Typography>

      <Stack spacing={1}>
        {legenda.map((item) => (
          <Stack
            direction='row'
            key={item.tipoDocumento}
            alignItems='center'
            spacing={1}
          >
            <Box
              component='span'
              sx={{
                width: 14,
                height: 14,
                backgroundColor: item.cor,
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.2)',
              }}
            />
            <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
              {item.tipoDocumento.toLowerCase()}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default GraphLegend;
