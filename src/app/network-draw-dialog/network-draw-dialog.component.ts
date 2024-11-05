import { Component, Inject } from '@angular/core';
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
import { NetworkService } from '../shared/network.service';

@Component({
  selector: 'app-network-draw-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './network-draw-dialog.component.html',
  styleUrl: './network-draw-dialog.component.scss',
})
export class NetworkDrawDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      networkID: number,
      currentCapacity: number;
    },
    private networkService: NetworkService,
    private dialogRef: MatDialogRef<NetworkDrawDialogComponent>,
  ) {}

  drawControl = new FormControl(0, [
    Validators.required,
    Validators.min(0.01),
    Validators.max(this.data!.currentCapacity),
  ]);

  drawStore(): void {
    this.dialogRef.close();
    this.networkService.drawFromNetwork(this.data.networkID, this.drawControl.value!);
  }
}
