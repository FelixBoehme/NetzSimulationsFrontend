import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { KeyValuePipe } from '@angular/common';
import { navRoutes } from '../routes';
import { KeycloakService } from 'keycloak-angular';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    KeyValuePipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  public routes = navRoutes;

  constructor(private readonly keycloak: KeycloakService) {}

  public logout() {
    this.keycloak.logout();
  }
}
