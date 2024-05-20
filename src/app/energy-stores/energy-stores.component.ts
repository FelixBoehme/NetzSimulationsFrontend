import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OverviewService } from '../overview/overview.service';
import {
  EnergyStore,
  EnergyStoresService,
  NewEnergyStore,
} from './energy-stores.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
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

  constructor(
    private energyStoreService: EnergyStoresService,
    private formBuilder: FormBuilder,
  ) {}

  energyStores: EnergyStore[] = [];
  popupActive: Boolean = false;

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
      type: this.storeForm.get('type')?.value?.name,
      maxCapacity: this.storeForm.get('maxCapacity')?.value,
      currentCapacity: this.storeForm.get('currentCapacity')?.value,
      location: this.storeForm.get('location')?.value,
    } as NewEnergyStore;

    this.energyStoreService
      .addEnergyStore(newEnergyStore)
      .subscribe((energyStore) => this.energyStores.push(energyStore));

    this.newStore.emit(newEnergyStore);

    this.closePopup();
  }

  deleteStoreFromNetwork(store: EnergyStore): void {
    this.energyStoreService.deleteStoreFromNetwork(store.id).subscribe();

    this.energyStores = this.energyStores.filter((s) => s !== store);

    this.removedStore.emit(store);
  }

  openPopup(): void {
    this.popupActive = true;
  }

  closePopup(): void {
    this.popupActive = false;
  }
}
