import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css',
})
export class PopupComponent {
  popupActive: boolean = false;

  openPopup(): void {
    this.popupActive = true;
  }

  closePopup(): void {
    this.popupActive = false;

    // this.storeForm.reset(); //TODO: reset to default values
  }
}
