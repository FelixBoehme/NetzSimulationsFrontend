import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { inject } from '@angular/core';

export function AuthGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
  const keycloak = inject(KeycloakService);
  const router = inject(Router);

  return new Promise(async (resolve, reject) => {
    if (!await keycloak.isLoggedIn()) {
      await keycloak.login();
      return resolve(false);
    }
    resolve(true);
  });
}
