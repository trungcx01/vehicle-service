import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService)

  const token = localStorage.getItem('token');


  if (!token) {
    toastr.info("Bạn cần đăng nhập để truy cập vào trang này!")
    router.navigate(['/login']);
    return false;
  }

  try {

    const payload = JSON.parse(atob(token.split('.')[1])); // Decode phần payload

    console.log(payload);
    const isTokenExpired = payload.exp * 1000 < Date.now();
    if (isTokenExpired) {
      toastr.info("Phiên đăng nhập đã hết hạn!")
      router.navigate(['/login']);
      return false;
    }


    const role = payload.roles?.[0];

    const allowedRoles = route!.data['roles'] as Array<string>;

    if (!allowedRoles.includes(role)) {
      console.log(role);
      console.log(allowedRoles);
      router.navigate(['/unauthorized']);
      return false;
    }


    return true;

  } catch (error) {
    console.error('Token không hợp lệ:', error);
    router.navigate(['/login']);
    return false;
  }
};

