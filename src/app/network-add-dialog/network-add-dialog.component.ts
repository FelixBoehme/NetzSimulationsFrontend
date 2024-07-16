import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NetworkService } from '../shared/network.service';

@Component({
  selector: 'app-network-add-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './network-add-dialog.component.html',
  styleUrl: './network-add-dialog.component.scss',
})
export class NetworkAddDialogComponent {
  constructor(private networkService: NetworkService) {}

  networkNameControl = new FormControl('', [Validators.required]);

  addNetwork(): void {
    const networkName: string = this.networkNameControl.value!;
    this.networkService.addNetwork(networkName);
  }
}
