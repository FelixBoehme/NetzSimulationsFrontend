import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Store } from './store';
import { Observable, Subject, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private url = environment.apiUrl + 'energyStore';
  private storeChange: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {}

  addStore(
    location: string,
    type: Store['type'],
    maxCapacity: number,
    currentCapacity: number,
    networkId?: number,
  ): void {
    let addUrl = networkId ? `${this.url}/network/${networkId}` : this.url;
    this.http
      .post<Store>(
        addUrl,
        {
          location: location,
          type: type,
          maxCapacity: maxCapacity,
          currentCapacity: currentCapacity,
          networkId: networkId,
        },
        { observe: 'response' },
      )
      .pipe(timeout(5000))
      .subscribe((resp) => {
        if (resp.status === 201) {
          this.storeChange.next();
        }
      });
  }

  editStore(
    storeID: number,
    location: string,
    type: Store['type'],
    maxCapacity: number,
    currentCapacity: number,
  ): void {
    let addUrl = `${this.url}/${storeID}`;
    this.http
      .put<Store>(
        addUrl,
        {
          location: location,
          type: type,
          maxCapacity: maxCapacity,
          currentCapacity: currentCapacity,
        },
        { observe: 'response' },
      )
      .pipe(timeout(5000))
      .subscribe((resp) => {
        if (resp.status === 200) {
          this.storeChange.next();
        }
      });
  }

  deleteStore(storeID: number): void {
    this.http
      .delete(`${this.url}/${storeID}`, { observe: 'response' })
      .subscribe((resp) => {
        if (resp.status === 200) {
          this.storeChange.next();
        }
      });
  }

  fillStore(storeID: number, fillAmount: number): void {
    this.http
      .put(
        `${this.url}/${storeID}/capacity/${fillAmount}`,
        {},
        { observe: 'response' },
      )
      .subscribe((resp) => {
        if (resp.status === 200) {
          this.storeChange.next();
        }
      });
  }

  onStoreChange(): Observable<void> {
    return this.storeChange.asObservable();
  }
}
