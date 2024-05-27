import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Overview {
  maxCapacity: number;
  currentCapacity: number;
  percentageCapacity: number;
}

export interface Network {
  name: string;
}

// TODO: Error handling

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  url = environment.apiUrl + 'network/1/capacity';

  constructor(private http: HttpClient) {}

  getOverview() {
    return this.http.get<Overview>(this.url);
  }

  addNetwork(network: Network) {
    return this.http.post<Network>(environment.apiUrl + 'network', network);
  }

  drawCapacity(amount: number) {
    return this.http.put<number>(this.url + '/' + amount, null);
  }
}
