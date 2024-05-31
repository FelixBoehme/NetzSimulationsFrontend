import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NewEnergyStore } from '../energy-store';
import { PopupComponent } from '../popup/popup.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PopupComponent],
  templateUrl: './add-popup.component.html',
  styleUrl: './add-popup.component.css',
})
export class AddPopupComponent {
  @Output() addStore = new EventEmitter<NewEnergyStore>(); // add NewEnergyStore type to separate file

  constructor(private formBuilder: FormBuilder) {}

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

  addEnergyStore(): void {
    const newEnergyStore = {
      type: this.storeForm.get('type')?.value?.name,
      maxCapacity: this.storeForm.get('maxCapacity')?.value,
      currentCapacity: this.storeForm.get('currentCapacity')?.value,
      location: this.storeForm.get('location')?.value,
    } as NewEnergyStore;

    this.addStore.emit(newEnergyStore);

    this.storeForm.reset({
      location: '',
      maxCapacity: 0,
      currentCapacity: 0,
      type: this.types[0],
    });
  }
}
