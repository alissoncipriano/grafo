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
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        component='main'
        maxWidth='md'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          p: 3,
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
