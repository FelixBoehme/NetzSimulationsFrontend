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
  networkName: undefined | string;
  networks: Network[] = [];
  constructor(private networkService: NetworkService) {}

  ngOnInit(): void {
    this.networkService
      .getCurrentNetwork()
      .subscribe((network) => (this.networkName = network?.name));

    this.networkService
      .getAllNetworks()
      .subscribe((networks) => (this.networks = networks));
  }

  setNetwork(network: Network): void {
    this.networkService.setCurrentNetwork(network);
  }
}
