import { Component, OnDestroy } from '@angular/core';
import { StoreTableComponent } from '../store-table/store-table.component';
import { Observable, Subject, interval, merge, share, takeUntil } from 'rxjs';
import { StoreService } from '../shared/store.service';

@Component({
  selector: 'app-store-overview',
  standalone: true,
  imports: [StoreTableComponent],
  templateUrl: './store-overview.component.html',
  styleUrl: './store-overview.component.scss',
})
export class StoreOverviewComponent implements OnDestroy {
  private destroy = new Subject<void>();
  pollTrigger: Observable<unknown> = merge(
    interval(5000),
    this.storeService.onStoreChange(),
  ).pipe(takeUntil(this.destroy), share());

  constructor(private storeService: StoreService) {}

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
