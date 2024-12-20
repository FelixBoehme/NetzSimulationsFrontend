import {
  APP_INITIALIZER,
  LOCALE_ID,
  NgModule,
  importProvidersFrom,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavbarComponent } from './navbar/navbar.component';
import { MatIconRegistry } from '@angular/material/icon';
import { registerLocaleData } from '@angular/common';
import * as de from '@angular/common/locales/de';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        realm: 'NetzSimulation',
        url: 'http://localhost:8081',
        clientId: 'login',
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    NavbarComponent,
    KeycloakAngularModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'de-DE',
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    importProvidersFrom(HttpClientModule),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry) {
    registerLocaleData(de.default);
    iconRegistry.setDefaultFontSetClass('material-symbols-rounded');
  }
}
