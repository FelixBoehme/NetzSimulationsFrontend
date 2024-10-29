import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Store } from './store';
import { BehaviorSubject, Observable, Subject, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private url = environment.apiUrl + 'energyStore';
  private networkCreated: Subject<void> = new Subject<void>();

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
        if (resp.status === 200) {
          this.networkCreated.next();
        }
      });
  }

  onStoreCreated(): Observable<void> {
    return this.networkCreated.asObservable();
  }
}
