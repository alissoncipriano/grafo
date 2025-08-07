import * as d3 from 'd3';

// Novo tipo para restringir os tipos de documento permitidos
export type TipoDocumento = 'PF' | 'PJ' | 'C';

// Definição da estrutura de entrada para cada nó, agora usando o tipo restrito
export interface INo {
  id: string;
  documento: string;
  tipoDocumento: TipoDocumento;
}

// Definição da estrutura de entrada para cada relacionamento (sem alterações)
export interface IRelacionamento {
  origem: string;
  alvo: string;
  descricao: string;
  nivel: number;
}

// Definição da estrutura de entrada para a legenda (sem alterações)
export interface ILegenda {
  tipoDocumento: TipoDocumento | string; // Permitindo string para flexibilidade
  cor: string;
  corClara: string;
}

// Estrutura completa da prop 'grafo' que o componente principal receberá
export interface IGrafo {
  nos: INo[];
  relacionamentos: IRelacionamento[];
  legenda: ILegenda[];
}

// Interface interna para o objeto de nó usado pela simulação D3
export interface NodeObject extends INo, d3.SimulationNodeDatum {}

// Interface interna para o objeto de link usado pela simulação D3
export interface LinkObject extends d3.SimulationLinkDatum<NodeObject> {
  source: string | NodeObject;
  target: string | NodeObject;
  descricao: string;
  nivel: number;
}
