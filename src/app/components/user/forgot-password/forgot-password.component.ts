import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.email) {
      this.authService.requestResetPass(this.email).subscribe({
        next: () => {
          this.showResetCodePrompt();
        },
        error: () => {
          this.toastr.error('Không thể gửi yêu cầu. Vui lòng thử lại!', 'Lỗi');
        },
      });
    } else {
      this.toastr.warning('Vui lòng nhập email trước!', 'Cảnh báo');
    }
  }

  showResetCodePrompt() {
    Swal.fire({
      title:
        '<h5 class="text-center" style="font-size: 24px; font-weight: 600;">Nhập mã xác thực và mật khẩu mới</h5>',
      html: `
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 mb-3">
              <p class="text-center" style="font-size: 1em; color: #6c757d;">
                Mã xác thực đã được gửi đến <strong>${this.email}</strong>. 
                Vui lòng nhập mã vào ô dưới đây và mật khẩu mới của bạn.
              </p>
            </div>
            <div class="col-12 mt-2">
              <input 
                id="resetCode" 
                class="form-control form-control-md mb-3" 
                type="text" 
                placeholder="Mã xác thực" />
    
              <input 
                id="newPassword" 
                class="form-control form-control-md mb-3" 
                type="password" 
                placeholder="Mật khẩu mới" />
    
              <input 
                id="confirmPassword" 
                class="form-control form-control-md" 
                type="password" 
                placeholder="Nhập lại mật khẩu mới" />
            </div>
          </div>
        </div>
      `,
      confirmButtonText: 'Xác thực',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
        const resetCode = (
          document.getElementById('resetCode') as HTMLInputElement
        ).value;
        const newPassword = (
          document.getElementById('newPassword') as HTMLInputElement
        ).value;
        const confirmPassword = (
          document.getElementById('confirmPassword') as HTMLInputElement
        ).value;

        if (!resetCode || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin!');
          return null;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage(
            'Mật khẩu mới và xác nhận mật khẩu không khớp!'
          );
          return null;
        }

        return { resetCode, newPassword };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with password reset process
        this.resetPassword(result.value.resetCode, result.value.newPassword);
      }
    });
  }

  resetPassword(resetKey: string, newPassword: string) {
    const form = {
      resetKey: resetKey,
      newPassword: newPassword,
    };
    console.log(resetKey);
    this.authService.resetPassword(form).subscribe({
      next: () => {
        this.toastr.success(
          'Mật khẩu đã được đặt lại thành công!',
          'Thành công'
        );
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastr.error(
          'Đặt lại mật khẩu thất bại. Vui lòng thử lại!',
          'Lỗi'
        );
      },
    });
  }
}
