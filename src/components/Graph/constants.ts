import { IGrafo } from './types';

// Dados de exemplo estáticos para o grafo.
export const MOCK_GRAFO: IGrafo = {
  nos: [
    // Nó Central
    { id: '0', documento: 'Documento Pesquisado', tipoDocumento: 'C' },
    // Nós Nível 1
    { id: '1', documento: 'Pessoa 1', tipoDocumento: 'PF' },
    { id: '2', documento: 'Empresa 2', tipoDocumento: 'PJ' },
    { id: '3', documento: 'Pessoa 3', tipoDocumento: 'PF' },
    { id: '4', documento: 'Empresa 4', tipoDocumento: 'PJ' },
    { id: '5', documento: 'Pessoa 5', tipoDocumento: 'PF' },
    // Nós Nível 2
    { id: '6', documento: 'Empresa 6', tipoDocumento: 'PJ' },
    { id: '7', documento: 'Pessoa 7', tipoDocumento: 'PF' },
    { id: '8', documento: 'Empresa 8', tipoDocumento: 'PJ' },
    { id: '9', documento: 'Pessoa 9', tipoDocumento: 'PF' },
    { id: '10', documento: 'Empresa 10', tipoDocumento: 'PJ' },
    { id: '11', documento: 'Pessoa 11', tipoDocumento: 'PF' },
    { id: '12', documento: 'Empresa 12', tipoDocumento: 'PJ' },
    { id: '13', documento: 'Pessoa 13', tipoDocumento: 'PF' },
    { id: '14', documento: 'Empresa 14', tipoDocumento: 'PJ' },
    { id: '15', documento: 'Pessoa 15', tipoDocumento: 'PF' },
    // Nós Nível 3
    { id: '16', documento: 'Empresa 16', tipoDocumento: 'PJ' },
    { id: '17', documento: 'Pessoa 17', tipoDocumento: 'PF' },
    { id: '18', documento: 'Empresa 18', tipoDocumento: 'PJ' },
    { id: '19', documento: 'Pessoa 19', tipoDocumento: 'PF' },
    { id: '20', documento: 'Empresa 20', tipoDocumento: 'PJ' },
    { id: '21', documento: 'Pessoa 21', tipoDocumento: 'PF' },
    { id: '22', documento: 'Empresa 22', tipoDocumento: 'PJ' },
    { id: '23', documento: 'Pessoa 23', tipoDocumento: 'PF' },
    { id: '24', documento: 'Empresa 24', tipoDocumento: 'PJ' },
    { id: '25', documento: 'Pessoa 25', tipoDocumento: 'PF' },
    { id: '26', documento: 'Empresa 26', tipoDocumento: 'PJ' },
    { id: '27', documento: 'Pessoa 27', tipoDocumento: 'PF' },
    { id: '28', documento: 'Empresa 28', tipoDocumento: 'PJ' },
    { id: '29', documento: 'Pessoa 29', tipoDocumento: 'PF' },
  ],
  relacionamentos: [
    // Relacionamentos Nível 1
    { origem: '0', alvo: '1', descricao: 'Sócio', nivel: 1 },
    { origem: '0', alvo: '2', descricao: 'Sócio', nivel: 1 },
    { origem: '0', alvo: '3', descricao: 'Sócio', nivel: 1 },
    { origem: '0', alvo: '4', descricao: 'Sócio', nivel: 1 },
    { origem: '0', alvo: '5', descricao: 'Sócio', nivel: 1 },
    // Relacionamentos Nível 2
    { origem: '1', alvo: '6', descricao: 'Pai', nivel: 2 },
    { origem: '2', alvo: '7', descricao: 'Pai', nivel: 2 },
    { origem: '3', alvo: '8', descricao: 'Pai', nivel: 2 },
    { origem: '4', alvo: '9', descricao: 'Pai', nivel: 2 },
    { origem: '5', alvo: '10', descricao: 'Pai', nivel: 2 },
    { origem: '1', alvo: '11', descricao: 'Pai', nivel: 2 },
    { origem: '2', alvo: '12', descricao: 'Pai', nivel: 2 },
    { origem: '3', alvo: '13', descricao: 'Pai', nivel: 2 },
    { origem: '4', alvo: '14', descricao: 'Pai', nivel: 2 },
    { origem: '5', alvo: '15', descricao: 'Pai', nivel: 2 },
    // Relacionamentos Nível 3
    { origem: '6', alvo: '16', descricao: 'Irmão', nivel: 3 },
    { origem: '7', alvo: '17', descricao: 'Irmão', nivel: 3 },
    { origem: '8', alvo: '18', descricao: 'Irmão', nivel: 3 },
    { origem: '9', alvo: '19', descricao: 'Irmão', nivel: 3 },
    { origem: '10', alvo: '20', descricao: 'Irmão', nivel: 3 },
    { origem: '11', alvo: '21', descricao: 'Irmão', nivel: 3 },
    { origem: '12', alvo: '22', descricao: 'Irmão', nivel: 3 },
    { origem: '13', alvo: '23', descricao: 'Irmão', nivel: 3 },
    { origem: '14', alvo: '24', descricao: 'Irmão', nivel: 3 },
    { origem: '15', alvo: '25', descricao: 'Irmão', nivel: 3 },
    { origem: '6', alvo: '26', descricao: 'Irmão', nivel: 3 },
    { origem: '7', alvo: '27', descricao: 'Irmão', nivel: 3 },
    { origem: '8', alvo: '28', descricao: 'Irmão', nivel: 3 },
    { origem: '9', alvo: '29', descricao: 'Irmão', nivel: 3 },
  ],
  legenda: [
    { tipoDocumento: 'C', cor: '#e63946', corClara: '#f1faee' }, // Vermelho forte para o central
    { tipoDocumento: 'PF', cor: '#457b9d', corClara: '#a8dadc' }, // Azul para Pessoa Física
    { tipoDocumento: 'PJ', cor: '#1d3557', corClara: '#a8dadc' }, // Azul escuro para Pessoa Jurídica
  ],
};
