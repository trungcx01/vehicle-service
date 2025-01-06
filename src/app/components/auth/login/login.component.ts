import { NotificationService } from './../../../services/notification.service';
import { HeaderComponent } from './../../../layouts/header/header.component';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLogin = false;

  constructor(
    private fb: FormBuilder,
    protected authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  save(): void {
    this.isLogin = true;
    const loginAccount = this.loginForm.value;
    if (this.loginForm.valid) {
      this.authService.login(loginAccount).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.accessToken);
          console.log(res.accessToken);

          this.authService.getCurrentUser().subscribe({
            next: (res) => {
              console.log(res);
              if (res.roles.length !== 0) {
                const role = res.roles[0].name;
                if (role === 'SHOP') {
                  this.router.navigate(['/shop-home']).then(() => {
                    window.location.reload();
                  });
                } else if (role === 'CUSTOMER') {
                  this.router.navigate(['']).then(() => {
                    window.location.reload();
                  });
                  this.toastr.success('Đăng nhập thành công!');
                }
                else if (role === 'ADMIN') {
                  this.toastr.success('Đăng nhập thành công!');
                  this.router.navigate(['/admin'])
                }
              } else {
                this.toastr.success('Đăng nhập thành công!');
                this.router.navigate(['/registration-info']);
              }
            },
            error: (err) => {
              console.log(err);
            },
          });
        },
        error: (err) => {
          // this.toastr.error(err.error.message)
          Swal.fire("Lỗi", err.error.message, "error");
          console.log(err);
        },
      });
    }
  }

  navigateToSignUp(): void {
    this.router.navigate(['signup']);
  }
}
