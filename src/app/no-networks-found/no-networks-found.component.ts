import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NetworkAddDialogComponent } from '../network-add-dialog/network-add-dialog.component';

@Component({
  selector: 'app-no-networks-found',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './no-networks-found.component.html',
  styleUrl: './no-networks-found.component.scss',
})
export class NoNetworksFoundComponent {
  constructor(private dialog: MatDialog) {}

  openNetworkAddDialog(): void {
    this.dialog.open(NetworkAddDialogComponent);
  }
}
