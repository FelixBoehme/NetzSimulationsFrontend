import { Component, OnInit } from '@angular/core';
import { StoreListService } from './store-list.service';
import { EnergyStore } from '../energy-store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.css',
})
export class StoreListComponent implements OnInit {
  constructor(private storeListService: StoreListService) {}

  energyStores: EnergyStore[] = [];

  ngOnInit(): void {
    this.getUnassignedEnergyStores();
  }

  getUnassignedEnergyStores() {
    this.storeListService
      .getUnassignedStores()
      .subscribe((energyStores) => (this.energyStores = energyStores));
  }

  addUnassignedEnergyStore() {
    this.storeListService
      .addUnassignedEnergyStore()
      .subscribe((energyStore) => this.energyStores.push(energyStore));
  }

  softDeleteStore(store: EnergyStore) {
    this.storeListService
      .softDeleteStore(store.id)
      .subscribe(() => this.getUnassignedEnergyStores());
  }
}
