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
import { MatDialog } from '@angular/material/dialog';
import { StoreAddDialogComponent } from '../store-add-dialog/store-add-dialog.component';

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
  @Input() pollTrigger!: Observable<number>;
  @Input({ required: true }) stores!: 'all' | 'network';
  @Input({ alias: 'disable' }) disabledColumns: String = '';
  @Input() filters: { label: String; filter: String }[] = [
    { label: 'SOLAR', filter: 'type:SOLAR' },
    { label: 'WIND', filter: 'type:WIND' },
    { label: 'KONVENTIONELL', filter: 'type:CONVENTIONAL' },
    { label: 'LEER', filter: 'currentCapacity:0' },
  ];

  displayedColumns: {key: keyof Store, label: string}[] = [
    {key:'location', label: "Standort" },
    {key:'type', label: "Typ"},
    {key:'currentCapacity', label: "Aktuelle Kapazität"},
    {key:'maxCapacity', label: "Maximale Kapazität"},
    {key:'id', label:"ID"},
    {key:'networkName', label: "Netzwerkname"},
    {key:'networkId', label: "Netzwerk ID"},
  ];
  displayedColumnsKeys: (keyof Store)[] = [];
  typeMap: Record<string, string> = {
    "SOLAR": "Solar",
    "WIND": "Wind",
    "CONVENTIONAL": "Konventionell",
  }
  data: Store[] = [];
  networkId: undefined | number;
  isLoading: boolean = true;
  resultsLength: number = 0;
  private destroy = new Subject<void>();
  locationControl = new FormControl('');
  chipsControl = new FormControl([]);

  constructor(
    private http: HttpClient,
    private networkService: NetworkService,
    private storeAddDialog: MatDialog,
  ) {
    this.networkService.getCurrentNetwork().subscribe((network) => {
      this.networkId = network!.id;
    });
  }

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel="Ergebnisse pro Seite:";
    this.paginator._intl.nextPageLabel="Nächste Seite";
    this.paginator._intl.previousPageLabel="Vorherige Seite";
    this.paginator._intl.getRangeLabel=(page: number, pageSize: number, length: number) => {
      if (length == 0 || pageSize == 0) {
        return `0 von ${length}`;
      }

      length = Math.max(length, 0);

      const startIndex = page * pageSize;

      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex =
        startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

      return `${startIndex + 1} – ${endIndex} von ${length}`;
    };

    let disabledColumns = this.disabledColumns.split(/, +/);
    if (this.stores === 'network') {
      disabledColumns.push('networkName', 'networkId');
    }

    this.displayedColumns = this.displayedColumns.filter(
      (col) => !disabledColumns.includes(col.key),
    );
    this.displayedColumnsKeys = this.displayedColumns.map(col => col.key);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
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
      this.pollTrigger
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
        takeUntil(this.destroy),
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

  openStoreAddDialog(): void {
    this.storeAddDialog.open(StoreAddDialogComponent, {data: this.stores === 'network' ? {networkId: this.networkId} : {}});
  }
}
