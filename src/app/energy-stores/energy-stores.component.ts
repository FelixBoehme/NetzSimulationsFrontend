import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OverviewService } from '../overview/overview.service';
import { EnergyStoresService, NewEnergyStore } from './energy-stores.service';
import { EnergyStore } from '../energy-store';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-energy-stores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  types: { name: String; display: String }[] = [
    { name: 'SOLAR', display: 'Solar' },
    { name: 'WIND', display: 'Wind' },
    { name: 'CONVENTIONAL', display: 'Konventionell' },
  ];

  private lessOrEqValidator(
    controlName: string,
    compareControlName: string,
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const compareControl = formGroup.get(compareControlName);

      if (!control || !compareControl) {
        return null;
      }

      const controlValue = control.value;
      const compareControlValue = compareControl.value;

      if (
        controlValue !== null &&
        compareControlValue !== null &&
        controlValue > compareControlValue
      ) {
        return { lessThan: true };
      }

      return null;
    };
  }

  storeForm = this.formBuilder.group(
    {
      location: ['', Validators.required],
      maxCapacity: [0, Validators.min(0)],
      currentCapacity: [0, Validators.min(0)],
      type: [this.types[0], Validators.required],
    },
    {
      validators: this.lessOrEqValidator('currentCapacity', 'maxCapacity'),
    },
  );

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

  addEnergyStore(): void {
    const newEnergyStore = {
      type: this.storeForm.get('type')?.value?.name,
      maxCapacity: this.storeForm.get('maxCapacity')?.value,
      currentCapacity: this.storeForm.get('currentCapacity')?.value,
      location: this.storeForm.get('location')?.value,
    } as NewEnergyStore;

    this.energyStoreService
      .addEnergyStore(newEnergyStore)
      .subscribe((energyStore) => this.energyStores.push(energyStore));

    this.newStore.emit(newEnergyStore);

    this.closeAddPopup();
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

  openAddPopup(): void {
    this.addPopupActive = true;
  }

  closeAddPopup(): void {
    this.addPopupActive = false;

    this.storeForm.reset(); //TODO: reset to default values
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
