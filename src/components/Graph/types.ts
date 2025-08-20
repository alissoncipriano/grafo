import * as d3 from 'd3';

export type TipoDocumento = 'PF' | 'PJ' | 'C';

export interface INo {
  id: string;
  documento: string;
  tipoDocumento: TipoDocumento;
}

export interface IRelacionamento {
  origem: string;
  alvo: string;
  descricao: string;
  nivel: number;
}

export interface ILegenda {
  tipoDocumento: TipoDocumento | string;
  cor: string;
  corClara: string;
}

export interface IGrafo {
  nos: INo[];
  relacionamentos: IRelacionamento[];
  legenda: ILegenda[];
}

export interface NodeObject extends INo, d3.SimulationNodeDatum {}

export interface LinkObject extends d3.SimulationLinkDatum<NodeObject> {
  source: string | NodeObject;
  target: string | NodeObject;
  descricao: string;
  nivel: number;
}
