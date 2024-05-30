import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EnergyStore } from '../energy-store';

export interface NewEnergyStore {
  type: String;
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
    return this.http.get<EnergyStore[]>(
      environment.apiUrl + 'network/1/stores',
    );
  }

  addEnergyStore(energyStore: NewEnergyStore) {
    return this.http.post<EnergyStore>(
      this.energyStoreURL + 'network/1',
      energyStore,
    );
  }

  deleteStoreFromNetwork(storeId: number) {
    return this.http.delete(this.energyStoreURL + storeId + '/network');
  }

  increaseCapacity(storeId: number, amount: number) {
    return this.http.put(
      this.energyStoreURL + storeId + '/capacity/' + amount,
      null,
    );
  }
}
