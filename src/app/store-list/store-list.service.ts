import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EnergyStore } from '../energy-store';

@Injectable({
  providedIn: 'root',
})
export class StoreListService {
  energyStoreURL = environment.apiUrl + 'energyStore';

  constructor(private http: HttpClient) {}

  getUnassignedStores() {
    return this.http.get<EnergyStore[]>(this.energyStoreURL + '/unassigned');
  }

  addUnassignedEnergyStore(energyStore: EnergyStore) {
    return this.http.post<EnergyStore>(this.energyStoreURL, energyStore);
  }

  softDeleteStore(storeId: number) {
    return this.http.delete(this.energyStoreURL + '/' + storeId);
  }
}
