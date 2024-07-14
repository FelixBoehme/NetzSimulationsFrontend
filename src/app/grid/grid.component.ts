import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../shared/network.service';
import { NetworkPickerComponent } from '../network-picker/network-picker.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { interval } from 'rxjs';
import { NetworkOverviewComponent } from '../network-overview/network-overview.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    NetworkPickerComponent,
    NetworkOverviewComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit {
  networksExist: undefined | boolean;

  constructor(private networkService: NetworkService) {
    this.networkService
      .getNetworksExist()
      .subscribe(
        (networksExist) => (this.networksExist = networksExist ?? undefined),
      );

    interval(5000).subscribe(() => this.networkService.refreshNetworks());
  }

  ngOnInit(): void {
    this.networkService.refreshNetworks();
  }
}
