import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../shared/network.service';
import { NetworkPickerComponent } from '../network-picker/network-picker.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [NetworkPickerComponent, MatProgressSpinnerModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit {
  networksExist: undefined | boolean;

  constructor(public networkService: NetworkService) {
    this.networkService
      .getNetworksExist()
      .subscribe(
        (networksExist) => (this.networksExist = networksExist ?? undefined),
      );

  }

  ngOnInit(): void {
    this.networkService.refreshNetworks();
  }
}
