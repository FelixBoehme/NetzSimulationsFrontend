export interface EnergyStore {
  id: number;
  type: 'SOLAR' | 'WIND' | 'CONVENTIONAL';
  maxCapacity: number;
  currentCapacity: number;
  location: String;
}

