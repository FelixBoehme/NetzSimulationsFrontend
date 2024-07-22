export interface Store {
  id: number;
  type: 'SOLAR' | 'WIND' | 'CONVENTIONAL';
  currentCapacity: number;
  maxCapacity: number;
  location: string;
  networkName: undefined | string;
  networkId: undefined | number;
}
