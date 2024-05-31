import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EnergyStore } from '../energy-store';
import { NewEnergyStore } from '../energy-store';

export interface Network {
  name: string;
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class StoreListService {
  energyStoreURL = environment.apiUrl + 'energyStore';

  constructor(private http: HttpClient) {}

  getUnassignedStores() {
    return this.http.get<EnergyStore[]>(this.energyStoreURL + '/unassigned');
  }

  addUnassignedEnergyStore(energyStore: NewEnergyStore) {
    return this.http.post<EnergyStore>(this.energyStoreURL, energyStore);
  }

  softDeleteStore(storeId: number) {
    return this.http.delete(this.energyStoreURL + '/' + storeId);
  }

  getNetworks() {
    return this.http.get<Network[]>(environment.apiUrl + 'network/all');
  }

  addToNetwork(networkId: number, storeId: number) {
    return this.http.put(
      environment.apiUrl + 'network/' + networkId + '/energyStore/' + storeId,
      null,
    );
  }
}
