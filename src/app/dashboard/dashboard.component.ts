import { Component, OnInit } from '@angular/core';
import { NetworkGraphComponent } from '../network-graph/network-graph.component';
import { NetworkService } from '../shared/network.service';
import { SimNode } from '../network-graph/node';
import { SimLink } from '../network-graph/link';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NetworkGraphComponent, MatProgressSpinner],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  public nodes: SimNode[] = [];
  public links: SimLink[] = [];
  public isLoading: boolean = true;

  constructor(
    private networkService: NetworkService,
  ) {}

  ngOnInit(): void {
    this.networkService.getCurrentNetwork().subscribe((network) => {
      if (network !== undefined) {
        let localNodes: SimNode[] = [];
        let localLinks: SimLink[] = [];

        localNodes.push({
          id: network!.name,
          group: 0,
          r: network!.maxCapacity,
          fill: network!.percentageCapacity * 100,
        });
        this.networkService
          .getStores(network.id)
          .pipe(
            map((stores) => {
              this.isLoading = false;
              return stores;
            }),
          )
          .subscribe((stores) => {
            stores.stores.map((store) => {
              localNodes.push({
                id: store.location,
                group: 1,
                r: store.maxCapacity,
                fill: (store.currentCapacity / store.maxCapacity) * 100,
              });
            });
            localLinks.push(
              ...stores.stores.map((store) => {
                return {
                  source: network.name,
                  target: store.location,
                };
              }),
            );
            this.nodes = localNodes;
            this.links = localLinks;
          });
      }
    });
  }
}
