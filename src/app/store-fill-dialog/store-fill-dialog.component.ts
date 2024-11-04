import { Component, Inject, Input } from '@angular/core';
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

@Component({
  selector: 'app-store-fill-dialog',
  standalone: true,
  imports: [
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
    Validators.min(1),
    Validators.max(this.data!.maxCapacity - this.data!.currentCapacity),
  ]);

  fillStore(): void {
    this.dialogRef.close()
    this.storeService.fillStore(this.data.storeID, this.fillControl.value!);
  }
}
