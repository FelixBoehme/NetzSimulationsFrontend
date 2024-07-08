import { Component, OnInit } from '@angular/core';
import { Network } from '../shared/network';
import { NetworkService } from '../shared/network.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-network-picker',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './network-picker.component.html',
  styleUrl: './network-picker.component.scss',
})
export class NetworkPickerComponent implements OnInit {
  networks: Network[] = [];
  constructor(public networkService: NetworkService) {}

  ngOnInit(): void {
    this.networkService.getAllNetworks().subscribe((networks) => {
      this.networks = networks;

      if (
        networks.length != 0 &&
        this.networkService.getCurrentNetwork() === undefined
      ) {
        this.networkService.setCurrentNetwork(networks[0]);
      }
    });
  }

  setNetwork(network: Network): void {
    this.networkService.setCurrentNetwork(network);
  }

  getNetworkName(): undefined | string {
    return this.networkService.getCurrentNetwork()?.name;
  }
}
