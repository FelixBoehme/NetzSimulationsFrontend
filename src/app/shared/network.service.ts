import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Network } from './network';
import { BehaviorSubject, Observable, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private url = environment.apiUrl + 'network/';
  private currentNetwork: BehaviorSubject<undefined | Network> =
    new BehaviorSubject<undefined | Network>(undefined);
  private allNetworks: BehaviorSubject<Network[]> =
    new BehaviorSubject<Network[]>([]);
  private networksExist: BehaviorSubject<undefined | boolean> =
    new BehaviorSubject<undefined | boolean>(undefined);

  constructor(private http: HttpClient) {
    this.refreshNetworks();
  }

  refreshNetworks(): void {
    this.http
      .get<Network[]>(this.url + 'all')
      .pipe(timeout(5000))
      .subscribe({
        next: (networks: Network[]) => {
          this.allNetworks.next(networks);
          this.setCurrentNetwork(networks[0] ?? undefined);
          this.networksExist.next(networks.length > 0)
        },
        error: (error) => {
          console.log('Request timed out or failed:', error); //TODO: show visual feedback
        },
      });
  }

  getCurrentNetwork(): Observable<undefined | Network> {
    return this.currentNetwork.asObservable();
  }

  setCurrentNetwork(network: undefined | Network): void {
    this.currentNetwork.next(network);
  }

  getAllNetworks(): Observable<Network[]> {
    return this.allNetworks.asObservable();
  }

  getNetworksExist(): Observable<undefined | boolean> {
    return this.networksExist.asObservable();
  }
}
