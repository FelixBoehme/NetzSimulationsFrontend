import { Component, OnDestroy, OnInit } from '@angular/core';
import { NetworkService } from '../shared/network.service';
import { NetworkPickerComponent } from '../network-picker/network-picker.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  interval,
  merge,
  share,
  takeUntil,
} from 'rxjs';
import { NetworkOverviewComponent } from '../network-overview/network-overview.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StoreTableComponent } from '../store-table/store-table.component';
import { StoreService } from '../shared/store.service';
import { NoNetworksFoundComponent } from '../no-networks-found/no-networks-found.component';

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
    NoNetworksFoundComponent,
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>();
  pollTrigger: Observable<unknown> = merge(
    interval(5000),
    this.storeService.onStoreChange(),
    this.networkService.getCurrentNetwork().pipe(
      debounceTime(1),
      distinctUntilChanged((prev, curr) => {
        return prev?.id === curr?.id;
      }),
    ),
    this.networkService.onNetworkChange(),
  ).pipe(takeUntil(this.destroy), share());
  networksExist: undefined | boolean;

  constructor(
    private networkService: NetworkService,
    private storeService: StoreService,
  ) {
    this.networkService
      .getNetworksExist()
      .subscribe(
        (networksExist) => (this.networksExist = networksExist ?? undefined),
      );
  }

  ngOnInit(): void {
    this.pollTrigger.subscribe(() => {
      this.networkService.refreshNetworks();
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
