import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NetworkService } from '../shared/network.service';
import { Network } from '../shared/network';
import { interval } from 'rxjs';

@Component({
  selector: 'app-network-overview',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './network-overview.component.html',
  styleUrl: './network-overview.component.scss',
})
export class NetworkOverviewComponent implements OnInit {
  network: undefined | Network;

  constructor(private networkService: NetworkService) {
    this.networkService.getCurrentNetwork().subscribe((network) => {
      this.network = network;
    });
  }

  ngOnInit(): void {
    interval(5000).subscribe(() => this.networkService.refreshNetwork());
  }
}
