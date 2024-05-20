import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Network, Overview, OverviewService } from './overview.service';
import { EnergyStoresComponent } from '../energy-stores/energy-stores.component';
import { EnergyStore } from '../energy-stores/energy-stores.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, EnergyStoresComponent],
  providers: [OverviewService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit {
  constructor(private overviewService: OverviewService) {}

  overview: Overview | undefined;

  ngOnInit(): void {
    this.getOverview();
  }

  getOverview(): void {
    this.overviewService
      .getOverview()
      .subscribe((overview) => (this.overview = overview));
  }

  updateNewStore(store: EnergyStore): void {
    this.overview!.maxCapacity += store.maxCapacity;
    this.overview!.currentCapacity += store.currentCapacity;
    this.overview!.percentageCapacity =
      this.overview!.currentCapacity / this.overview!.maxCapacity;
  }

  updateRemovedStore(store: EnergyStore): void {
    this.overview!.maxCapacity -= store.maxCapacity;
    this.overview!.currentCapacity -= store.currentCapacity;

    if (
      this.overview!.maxCapacity == 0 ||
      this.overview!.currentCapacity == 0
    ) {
      this.overview!.percentageCapacity = 0;
    } else {
      this.overview!.percentageCapacity =
        this.overview!.currentCapacity / this.overview!.maxCapacity;
    }
  }

  addNetwork(name: String): void {
    const newNetwork = { name } as Network;
    this.overviewService.addNetwork(newNetwork).subscribe();

    this.getOverview();
  }
}
