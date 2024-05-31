import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OverviewService } from '../overview/overview.service';
import { EnergyStoresService } from './energy-stores.service';
import { NewEnergyStore } from '../energy-store';
import { EnergyStore } from '../energy-store';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AddPopupComponent } from '../add-popup/add-popup.component';

@Component({
  selector: 'app-energy-stores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AddPopupComponent],
  providers: [OverviewService],
  templateUrl: './energy-stores.component.html',
  styleUrl: './energy-stores.component.css',
})
export class EnergyStoresComponent implements OnInit {
  @Output() newStore = new EventEmitter<NewEnergyStore>();
  @Output() removedStore = new EventEmitter<EnergyStore>();
  @Output() increasedCapacity = new EventEmitter<number>();

  constructor(
    private energyStoreService: EnergyStoresService,
    private formBuilder: FormBuilder,
  ) {}

  energyStores: EnergyStore[] = [];
  addPopupActive: Boolean = false;
  increasePopupActive: Boolean = false;

  private capacityValidator(store: EnergyStore | null): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const amount = formGroup.get('amount')?.value;

      if (!store || amount == null) {
        return null;
      }

      const availableCapacity = store.maxCapacity - store.currentCapacity;

      return availableCapacity >= amount ? null : { capacityExceeded: true };
    };
  }

  increaseStore: EnergyStore | null = null;
  increaseForm = this.formBuilder.group(
    {
      amount: [0, Validators.min(1)],
    },
    {
      validators: this.capacityValidator(this.increaseStore),
    },
  );

  ngOnInit(): void {
    this.getEnergyStores();
  }

  getEnergyStores(): void {
    this.energyStoreService
      .getEnergyStores()
      .subscribe((energyStores) => (this.energyStores = energyStores));
  }

  addEnergyStore(newEnergyStore: NewEnergyStore): void {
    this.energyStoreService
      .addEnergyStore(newEnergyStore)
      .subscribe((energyStore) => this.energyStores.push(energyStore));

    this.newStore.emit(newEnergyStore);
  }

  deleteStoreFromNetwork(store: EnergyStore): void {
    this.energyStoreService.deleteStoreFromNetwork(store.id).subscribe();

    this.energyStores = this.energyStores.filter((s) => s !== store);

    this.removedStore.emit(store);
  }

  increaseCapacity(): void {
    this.energyStoreService
      .increaseCapacity(
        this.increaseStore!.id,
        this.increaseForm.get('amount')?.value!,
      )
      .subscribe(() => this.getEnergyStores());

    this.increasedCapacity.emit(this.increaseForm.get('amount')?.value!);
    this.closeIncreasePopup();
  }

  openIncreasePopup(store: EnergyStore): void {
    this.increaseStore = store;
    this.increaseForm.setValidators(this.capacityValidator(store));

    this.increasePopupActive = true;
  }

  closeIncreasePopup(): void {
    this.increasePopupActive = false;

    this.increaseStore = null;
    this.increaseForm.reset(); //TODO: reset to default values
  }
}
