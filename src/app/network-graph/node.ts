import { SimulationNodeDatum } from 'd3';

export interface SimNode extends SimulationNodeDatum {
  id: string;
  group: number;
  r: number;
  fill: number;
}
