import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../shared/network.service';
import { NetworkPickerComponent } from '../network-picker/network-picker.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { interval } from 'rxjs';
import { NetworkOverviewComponent } from '../network-overview/network-overview.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NetworkAddDialogComponent } from '../network-add-dialog/network-add-dialog.component';
import { StoreTableComponent } from '../store-table/store-table.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    NetworkPickerComponent,
    NetworkOverviewComponent,
    StoreTableComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit {
  networksExist: undefined | boolean;

  constructor(
    private networkService: NetworkService,
    private dialog: MatDialog,
  ) {
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

  openNetworkAddDialog(): void {
    this.dialog.open(NetworkAddDialogComponent);
  }
}
