import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OverviewService } from '../overview/overview.service';
import { EnergyStore, EnergyStoresService } from './energy-stores.service';

@Component({
  selector: 'app-energy-stores',
  standalone: true,
  imports: [CommonModule],
  providers: [OverviewService],
  templateUrl: './energy-stores.component.html',
  styleUrl: './energy-stores.component.css',
})
export class EnergyStoresComponent implements OnInit {
  @Output() newStore = new EventEmitter<EnergyStore>();
  @Output() removedStore = new EventEmitter<EnergyStore>();

  constructor(private energyStoreService: EnergyStoresService) {}

  energyStores: EnergyStore[] = [];

  ngOnInit(): void {
    this.getEnergyStores();
  }

  getEnergyStores(): void {
    this.energyStoreService
      .getEnergyStores()
      .subscribe((energyStores) => (this.energyStores = energyStores));
  }

  //TODO: update overview after creating new energyStore
  addEnergyStore(): void {
    const newEnergyStore = {
      id: 2,
      type: 'SOLAR',
      maxCapacity: 5000,
      currentCapacity: 4000,
      location: 'Leipzig',
    } as EnergyStore;
    this.energyStoreService.addEnergyStore(newEnergyStore).subscribe((energyStore) => this.energyStores.push(energyStore));

    this.newStore.emit(newEnergyStore);
  }

  deleteStoreFromNetwork(store: EnergyStore): void {
    this.energyStoreService.deleteStoreFromNetwork(store.id).subscribe();

    this.energyStores = this.energyStores.filter(s => s !== store);

    this.removedStore.emit(store);
  }
}
