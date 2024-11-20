import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Network } from './network';
import { BehaviorSubject, Observable, Subject, timeout } from 'rxjs';
import { Store } from './store';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private url = environment.apiUrl + 'network/';
  private currentNetwork: BehaviorSubject<undefined | Network> =
    new BehaviorSubject<undefined | Network>(undefined);
  private allNetworks: BehaviorSubject<Network[]> = new BehaviorSubject<
    Network[]
  >([]);
  private networksExist: BehaviorSubject<undefined | boolean> =
    new BehaviorSubject<undefined | boolean>(undefined);
  private networkChange: Subject<void> = new Subject<void>();

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) {
    this.refreshNetworks();
  }

  addNetwork(networkName: string): void {
    this.http
      .post<Network>(environment.apiUrl + 'network', { name: networkName })
      .pipe(timeout(5000))
      .subscribe({
        next: (network: Network) => {
          this.networksExist.next(true);
          this.currentNetwork.next(this.currentNetwork.value ?? network);
          this.allNetworks.next([...this.allNetworks.value, network]);
        },
        error: (error) => {
          console.log('Request timed out or failed:', error);
          let snackBarRef = this._snackBar.open(
            "Couldn't add new Network.",
            'Retry',
            { duration: 3000 },
          );
          snackBarRef.onAction().subscribe(() => this.addNetwork(networkName));
        },
      });
  }

  refreshNetworks(): void {
    this.http
      .get<Network[]>(this.url + 'all')
      .pipe(timeout(5000)) //TODO: set consistent timeouts
      .subscribe({
        next: (networks: Network[]) => {
          this.allNetworks.next(networks);
          this.networksExist.next(networks.length > 0);

          if (
            this.currentNetwork.value === undefined ||
            networks.length === 0
          ) {
            this.setCurrentNetwork(networks[0] ?? undefined);
          }
        },
        error: (error) => {
          console.log('Request timed out or failed:', error);
          let snackBarRef = this._snackBar.open(
            'Unable to load data. Retrying in 5 Seconds.',
            'Retry',
            { duration: 3000 },
          );
          snackBarRef.onAction().subscribe(() => this.refreshNetworks());
        },
      });
  }

  refreshNetwork(): void {
    this.http
      .get<Network>(this.url + this.currentNetwork.value?.id)
      .pipe(timeout(5000))
      .subscribe({
        next: (network: Network) => {
          this.currentNetwork.next(network);
        },
        error: (error) => {
          console.log('Request timed out or failed:', error);
          let snackBarRef = this._snackBar.open(
            'Unable to load data. Retrying in 5 Seconds.',
            'Retry',
            { duration: 3000 },
          );
          snackBarRef.onAction().subscribe(() => this.refreshNetworks());
        },
      });
  }

  getStores(networkID: number) {
    return this.http.get<{ totalCount: number; stores: Store[] }>(
      `${this.url}${networkID}/stores`,
    );
  }

  drawFromNetwork(networkID: number, amount: number): void {
    this.http
      .put(
        `${this.url}${networkID}/capacity/${amount}`,
        {},
        { observe: 'response' },
      )
      .subscribe((resp) => {
        if (resp.status === 200) {
          this.networkChange.next();
        }
      });
  }

  deleteStoreFromNetwork(networkID: number, storeID: number): void {
    this.http
      .delete(
        `${this.url}${networkID}/energyStore/${storeID}`,
        { observe: 'response' },
      )
      .subscribe((resp) => {
        if (resp.status === 200) {
          this.networkChange.next();
        }
      });
  }

  moveToNetwork(storeID: number, networkID: number) {
    this.http
      .put(
        `${this.url}${networkID}/energyStore/${storeID}`,
        {},
        { observe: 'response' },
      )
      .subscribe((resp) => {
        if (resp.status === 200) {
          this.networkChange.next();
        }
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

  onNetworkChange(): Observable<void> {
    return this.networkChange.asObservable();
  }
}
