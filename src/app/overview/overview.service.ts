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
  overviewUrl = environment.apiUrl + 'network/1/capacity';

  constructor(private http: HttpClient) {}

  getOverview() {
    return this.http.get<Overview>(this.overviewUrl);
  }

  addNetwork(network: Network) {
    return this.http.post<Network>(environment.apiUrl + 'network', network);
  }
}
