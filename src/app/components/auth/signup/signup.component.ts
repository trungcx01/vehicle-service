import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivationComponent } from '../activation/activation.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    protected authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  activate() {
    Swal.close();
    Swal.fire({
      title: "Kích hoạt tài khoản",
      text: `<span style="font-size: 0.7em;">Mã kích hoạt đã được gửi đến email <strong>${
        this.signUpForm.get('email')!.value
      }</strong>. Vui lòng nhập vào ô dưới đây!</span>`,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      confirmButtonText: 'Kích hoạt',
      showLoaderOnConfirm: true,
      allowOutsideClick: false, 
      allowEscapeKey: false,  
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.activated(result.value).subscribe({
          next: (res) => {
            this.toastr.success('Đăng kí thành công!');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            Swal.showValidationMessage('Mã kích hoạt không hợp lệ');
            console.log(err);
          },
        });
        
      }
    });
  }


  onSignUp(): void {
    const signUp = {
      email: this.signUpForm.value.email,
      username: this.signUpForm.value.username,
      password: this.signUpForm.value.password,
    };
    const login = {
      username: this.signUpForm.value.username,
      password: this.signUpForm.value.password,
    };
    console.log(this.signUpForm.value);
    if (this.signUpForm.valid) {
      if (
        this.signUpForm.get('password')!.value ===
        this.signUpForm.get('confirmPassword')!.value
      ) {
        Swal.fire({
          title: 'Đang gửi mã kích hoạt...',
          text: 'Vui lòng chờ trong giây lát',
          allowOutsideClick: false, 
          allowEscapeKey: false,  
          didOpen: () => {
            Swal.showLoading(); 
          }
        });
        this.authService.signUp(signUp).subscribe({
          next: (res) => {
            console.log(res);
            this.toastr.success(
              'Đã gửi mã kích hoạt đến ' + this.signUpForm.get('email')!.value
            );
            this.activate();
          },
          error: (err) => {
            console.log(err);
            this.toastr.error(err.error.message);
          },
        });
      } else {
        this.toastr.error('Passwords do not match');
      }
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
