import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StoreService } from '../shared/store.service';
import { Store } from '../shared/store';

@Component({
  selector: 'app-store-add-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './store-add-dialog.component.html',
  styleUrl: './store-add-dialog.component.scss'
})
export class StoreAddDialogComponent {
  storeForm: FormGroup;
  storeTypes: {value: string, label: string}[] = [
    {value: "SOLAR", label: "Solar"},
    {value: "WIND", label: "Wind"},
    {value: "CONVENTIONAL", label: "Konventionell"},
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {networkId: number} | null,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private dialogRef: MatDialogRef<StoreAddDialogComponent>
  ) {
    this.storeForm = this.formBuilder.group(
      {
        storeLocationControl: ['', Validators.required],
        storeTypeControl: ['', Validators.required],
        storeMaxCapacityControl: [0, [Validators.required, Validators.min(1)]],
        storeCurrentCapacityControl: [0, [Validators.required, Validators.min(0)]],
      },
    );
    this.storeForm.setValidators(this.lessOrEqValidator())
  }



  private lessOrEqValidator(): ValidatorFn  {
    return (): ValidationErrors | null => {
      const maxCapacityControl = this.storeForm.controls['storeMaxCapacityControl'];
      const currentCapacityControl = this.storeForm.controls['storeCurrentCapacityControl'];

      if (maxCapacityControl.value !== null &&
          currentCapacityControl.value != null &&
          maxCapacityControl.value < currentCapacityControl.value) {
        currentCapacityControl.setErrors({lessThanEq: true});
      }
      return null;
    }
  }

  addStore(): void {
    this.dialogRef.close()

    const storeName: string = this.storeForm.get("storeLocationControl")?.value;
    const storeType: Store["type"]  = this.storeForm.get("storeTypeControl")?.value;
    const storeMaxCapacity: number = this.storeForm.get("storeMaxCapacityControl")?.value;
    const storeCurrentCapacity: number = this.storeForm.get("storeCurrentCapacityControl")?.value;
    this.storeService.addStore(storeName, storeType, storeMaxCapacity, storeCurrentCapacity, this.data?.networkId);
  }
}
