import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Store } from './store';
import { timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private url = environment.apiUrl + 'energyStore';

  constructor(
    private http: HttpClient,
  ) { }

  addStore(location: string, type: Store['type'], maxCapacity: number, currentCapacity: number, networkId?: number): void {
    let addUrl = networkId ? `${this.url}/network/${networkId}` : this.url;
    this.http
      .post<Store>(addUrl, {
        location: location,
        type: type,
        maxCapacity: maxCapacity,
        currentCapacity: currentCapacity,
        networkId: networkId,
      })
      .pipe(timeout(5000))
      .subscribe({})
  }
}
