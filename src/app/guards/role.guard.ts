import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService
    .getCurrentUser()
    .pipe(
      map((user) => {
        const role = user.roles[0].name;
        const allowedRoles = route!.data['roles'] as Array<string>;
        if (!allowedRoles.includes(role)){
          if (role === 'CUSTOMER'){
            router.navigate(['/unauthorized']);
          } else{
            router.navigate(['shop-home/unauthorized']);
          }
        }
        return allowedRoles.includes(role);
      })
    )
};
