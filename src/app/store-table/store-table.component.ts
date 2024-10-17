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
  debounceTime,
  distinctUntilChanged,
  interval,
  map,
  merge,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import { NetworkService } from '../shared/network.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-store-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './store-table.component.html',
  styleUrl: './store-table.component.scss',
})
export class StoreTableComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input({ required: true }) stores!: 'all' | 'network';
  @Input({ alias: 'disable' }) disabledColumns: String = '';
  @Input() filters: { label: String; filter: String }[] = [
    { label: 'SOLAR', filter: 'type:SOLAR' },
    { label: 'WIND', filter: 'type:WIND' },
    { label: 'CONVENTIONAL', filter: 'type:CONVENTIONAL' },
    { label: 'EMPTY', filter: 'currentCapacity:0' },
  ];

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
  locationControl = new FormControl('');
  chipsControl = new FormControl([]);

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

    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.locationControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
      ),
      this.chipsControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
      ),
      interval(5000),
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.getStores(
            this.networkId!,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.chipsControl.value!,
            this.locationControl.value!.toString(),
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
    filterChips: string[],
    filter: string,
  ): Observable<{ totalCount: number; stores: Store[] }> {
    let sortQuery = sort !== undefined ? `sort=${sort},${direction}` : "";

    const filterParts = [];
    if (filterChips) filterParts.push(filterChips);
    if (filter) filterParts.push(`location:${filter}`);

    const filterQuery = filterParts.length ? `&search=${filterParts.join(',')}` : '';

    const baseUrl = environment.apiUrl;
    const endpoint = this.stores === 'network' ? `network/${networkId}/stores` : 'energyStore/active';
    const url = `${baseUrl}${endpoint}?${sortQuery}&page=${page + 1}&size=15${filterQuery}`;

    return this.http.get<{ totalCount: number; stores: Store[] }>(url)
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
