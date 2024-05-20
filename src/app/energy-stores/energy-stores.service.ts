import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface EnergyStore {
  id: number,
  type: 'SOLAR' | 'WIND' | 'CONVENTIONAL';
  maxCapacity: number;
  currentCapacity: number;
  location: String;
}

@Injectable({
  providedIn: 'root',
})
export class EnergyStoresService {
  energyStoreURL = environment.apiUrl + 'energyStore/';

  constructor(private http: HttpClient) {}

  getEnergyStores() {
    return this.http.get<EnergyStore[]>(this.energyStoreURL + 'active');
  }

  addEnergyStore(energyStore: EnergyStore) {
    return this.http.post<EnergyStore>(
      this.energyStoreURL + 'network/1',
      energyStore,
    );
  }

  deleteStoreFromNetwork(storeNmb: number) {
    return this.http.delete(this.energyStoreURL + storeNmb + "/network")
  }
}
