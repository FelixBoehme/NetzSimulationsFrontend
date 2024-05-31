export interface EnergyStore {
  id: number;
  type: 'SOLAR' | 'WIND' | 'CONVENTIONAL';
  maxCapacity: number;
  currentCapacity: number;
  location: String;
}

export interface NewEnergyStore {
  type: String;
  maxCapacity: number;
  currentCapacity: number;
  location: String;
}

