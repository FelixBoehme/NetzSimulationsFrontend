import { Component, OnInit } from '@angular/core';
import { StoreListService } from './store-list.service';
import { EnergyStore } from '../energy-store';
import { CommonModule } from '@angular/common';
import { NewEnergyStore } from '../energy-store';
import { AddPopupComponent } from '../add-popup/add-popup.component';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule, AddPopupComponent],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.css',
})
export class StoreListComponent implements OnInit {
  constructor(private storeListService: StoreListService) {}

  energyStores: EnergyStore[] = [];

  ngOnInit(): void {
    this.getUnassignedEnergyStores();
  }

  getUnassignedEnergyStores(): void {
    this.storeListService
      .getUnassignedStores()
      .subscribe((energyStores) => (this.energyStores = energyStores));
  }

  addUnassignedEnergyStore(newEnergyStore: NewEnergyStore): void {
    this.storeListService
      .addUnassignedEnergyStore(newEnergyStore)
      .subscribe((energyStore) => this.energyStores.push(energyStore));
  }

  softDeleteStore(store: EnergyStore) {
    this.storeListService
      .softDeleteStore(store.id)
      .subscribe(() => this.getUnassignedEnergyStores());
  }
}
