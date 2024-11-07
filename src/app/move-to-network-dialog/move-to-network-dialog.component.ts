import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NetworkService } from '../shared/network.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Network } from '../shared/network';

@Component({
  selector: 'app-move-to-network-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './move-to-network-dialog.component.html',
  styleUrl: './move-to-network-dialog.component.scss',
})
export class MoveToNetworkDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      storeID: number;
    },
    private networkService: NetworkService,
  ) {}

  selectedNetworkID: undefined | number;
  networks: Network[] = [];

  ngOnInit() {
    this.networkService
      .getAllNetworks()
      .subscribe((networks) => (this.networks = networks));
  }

  moveToNetwork() {
    this.networkService.moveToNetwork(
      this.data.storeID,
      this.selectedNetworkID!,
    );
  }
}
