import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../shared/network.service';
import { Network } from '../shared/network';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit {
  networks: Network[] = [];
  constructor(public networkService: NetworkService) {}

  ngOnInit(): void {
    this.networkService.getAllNetworks().subscribe((networks) => {
      this.networks = networks;

      if (networks.length != 0 && this.networkService.getCurrentNetwork() === undefined) {
        this.networkService.setCurrentNetwork(networks[0]);
      }
    });
  }

  getNetworkName(): undefined | string {
    return this.networkService.getCurrentNetwork()?.name
  }
}
