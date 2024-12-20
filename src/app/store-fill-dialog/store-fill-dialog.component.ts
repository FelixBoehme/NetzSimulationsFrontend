import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StoreService } from '../shared/store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store-fill-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './store-fill-dialog.component.html',
  styleUrl: './store-fill-dialog.component.scss',
})
export class StoreFillDialogComponent {
  constructor(
    @Inject(LOCALE_ID) public localeID: string,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      storeID: number;
      maxCapacity: number;
      currentCapacity: number;
    },
    private storeService: StoreService,
    private dialogRef: MatDialogRef<StoreFillDialogComponent>,
  ) {}

  fillControl = new FormControl(0, [
    Validators.required,
    Validators.min(0.001),
    Validators.max(this.data!.maxCapacity - this.data!.currentCapacity),
  ]);

  fillStore(): void {
    this.dialogRef.close();
    this.storeService.fillStore(this.data.storeID, this.fillControl.value!);
  }
}
