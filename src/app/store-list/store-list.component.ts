import { Component, OnInit } from '@angular/core';
import { Network, StoreListService } from './store-list.service';
import { EnergyStore } from '../energy-store';
import { CommonModule } from '@angular/common';
import { NewEnergyStore } from '../energy-store';
import { AddPopupComponent } from '../add-popup/add-popup.component';
import { PopupComponent } from '../popup/popup.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [
    CommonModule,
    AddPopupComponent,
    PopupComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.css',
})
export class StoreListComponent implements OnInit {
  constructor(
    private storeListService: StoreListService,
    private formBuilder: FormBuilder,
  ) {}

  energyStores: EnergyStore[] = [];
  networks: Network[] = [];
  selectedStoreId: number | null = null;

  switchForm = this.formBuilder.group({
    network: [this.networks[0], Validators.required],
  });

  ngOnInit(): void {
    this.getUnassignedEnergyStores();
    this.getNetworks();
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

  getNetworks(): void {
    this.storeListService
      .getNetworks()
      .subscribe((networks) => (this.networks = networks));
  }

  addToNetwork(networkIdString: String) {
    const networkId = Number(networkIdString);

    this.storeListService
      .addToNetwork(networkId, this.selectedStoreId!)
      .subscribe(() => this.getUnassignedEnergyStores()); // TODO: maybe remove manually instead of making a request

    this.switchForm.reset();
  }
}
