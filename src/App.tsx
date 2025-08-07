import {
  Container,
  CssBaseline,
  Box,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import './App.css';
import Graph from './components/Graph/Graph';
import { MOCK_GRAFO } from './components/Graph/constants';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Um azul clássico
    },
    secondary: {
      main: '#dc004e', // Um rosa/vermelho vibrante
    },
    background: {
      default: '#f4f6f8', // Um cinza claro para o fundo
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline normaliza os estilos CSS, removendo inconsistências entre navegadores. */}
      <CssBaseline />
      <Container
        component='main'
        maxWidth='md'
        // A prop `sx` é a nova forma de adicionar estilos customizados.
        // Ela tem acesso direto ao tema (cores, espaçamento, etc.).
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          p: 3, // `p` é um atalho para `padding`, usando a unidade de espaçamento do tema.
        }}
      >
        <Box>
          <Graph grafo={MOCK_GRAFO} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
