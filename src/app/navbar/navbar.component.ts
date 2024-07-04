import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    KeyValuePipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  links: Map<string, string> = new Map<string, string>(
    [
      ["Dashboard", "dashboard"],
      ["Grid", "grid_on"],
      ["Stores", "bolt"]
    ]
  );
  activeLink = this.links.get("Dashboard");
}
