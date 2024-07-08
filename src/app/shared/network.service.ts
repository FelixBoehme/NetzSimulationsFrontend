import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Network } from './network';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private url = environment.apiUrl + 'network/';
  public currentNetwork: undefined | Network;

  constructor(private http: HttpClient) {}

  getCurrentNetwork(): undefined | Network {
    return this.currentNetwork;
  }

  setCurrentNetwork(network: Network): void {
    this.currentNetwork = network;
  }

  getAllNetworks() {
    return this.http.get<Network[]>(this.url + 'all');
  }
}
