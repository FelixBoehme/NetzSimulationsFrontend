import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '../shared/store';
import { environment } from '../../environments/environment';
import {
  Observable,
  Subject,
  interval,
  map,
  merge,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import { NetworkService } from '../shared/network.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-store-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './store-table.component.html',
  styleUrl: './store-table.component.scss',
})
export class StoreTableComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input({ required: true }) stores!: 'all' | 'network';
  @Input({ alias: 'disable' }) disabledColumns: String = '';

  displayedColumns: (keyof Store)[] = [
    'location',
    'type',
    'currentCapacity',
    'maxCapacity',
    'id',
    'networkName',
    'networkId',
  ];
  data: Store[] = [];
  networkId: undefined | number;
  isLoading: boolean = true;
  resultsLength: number = 0;
  isActive = new Subject<void>();

  constructor(
    private http: HttpClient,
    private networkService: NetworkService,
  ) {
    this.networkService.getCurrentNetwork().subscribe((network) => {
      this.networkId = network!.id;
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    let disabledColumns = this.disabledColumns.split(/, +/);
    if (this.stores === 'network') {
      disabledColumns.push('networkName', 'networkId');
    }

    this.displayedColumns = this.displayedColumns.filter(
      (col) => !disabledColumns.includes(col),
    );
  }

  ngOnDestroy(): void {
    this.isActive.next();
    this.isActive.complete();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, interval(5000))
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.getStores(
            this.networkId!,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          );
        }),
        map((data) => {
          this.isLoading = false;
          this.resultsLength = data.totalCount;
          return data.stores;
        }),
        takeUntil(this.isActive),
      )
      .subscribe((data) => (this.data = data));
  }

  getStores(
    networkId: number,
    sort: string,
    direction: string,
    page: number,
  ): Observable<{ totalCount: number; stores: Store[] }> {
    if (this.stores === 'network') {
      return this.http.get<{ totalCount: number; stores: Store[] }>(
        environment.apiUrl +
          `network/${networkId}/stores?sort=${sort},${direction}&page=${page + 1}`,
      );
    }

    return this.http.get<{ totalCount: number; stores: Store[] }>(
      environment.apiUrl +
        `energyStore/active?sort=${sort},${direction}&page=${page + 1}`,
    );
  }

  toHeaderCase(str: string): string {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/ /, '\n')
      .trim();
  }

  toTitleCase(input: undefined | number | string): string {
    if (input == undefined) return '';

    return (
      input.toString().charAt(0).toUpperCase() +
      input.toString().slice(1).toLowerCase()
    );
  }
}
