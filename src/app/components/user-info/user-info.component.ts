import { CustomerService } from './../../services/customer.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent implements OnInit {
  customerInfoForm: any;
  changePasswordForm: any;
  shopInfoForm: any;
  role: any;
  previewImage: any;
  username: any;
  avatar: any;
  type: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private customerService: CustomerService,
    private shopService: ShopService,
    private userService: UserService
  ) {
    this.customerInfoForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      dob: [''],
    });

    this.shopInfoForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      closeHour: [''],
      openHour: [''],
      description: [''],
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (!this.router.url.startsWith('/shop-home')) {
      this.role = 'CUSTOMER';
      this.customerService.getCurrentCustomer().subscribe({
        next: (res) => {
          this.previewImage = res.user.imageUrl;
          this.username = res.user.username;
          this.updateCustomerForm(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.role = 'SHOP';
      this.shopService.getCurrent().subscribe({
        next: (res) => {
          console.log(res);
          this.previewImage = res.user.imageUrl;
          this.username = res.user.username;
          this.updateShopForm(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.avatar = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  updateCustomerForm(customer: any) {
    this.customerInfoForm.patchValue({
      avatar: customer.user.imageUrl,
      id: customer.id,
      name: customer.name,
      address: customer.address,
      phoneNumber: customer.phoneNumber,
      dob: customer.dob,
    });
    console.log('io', this.customerInfoForm.value);
  }

  updateShopForm(shop: any) {
    // const time = String(shop.openingHour).split('-');
    this.shopInfoForm.patchValue({
      avatar: shop.user.imageUrl,
      id: shop.id,
      name: shop.name,
      address: shop.address,
      phoneNumber: shop.phoneNumber,
      openHour: shop.openHour.substring(0,5),
      closeHour: shop.closeHour.substring(0,5),
      description: shop.description,
    });
  }

  saveInfo() {
    if (this.role === 'SHOP') {
      const shop = {
        id: this.shopInfoForm.value.id,
        name: this.shopInfoForm.value.name,
        address: this.shopInfoForm.value.address,
        phoneNumber: this.shopInfoForm.value.phoneNumber,
        openHour: this.shopInfoForm.value.openHour,
        closeHour: this.shopInfoForm.value.closeHour,
        description: this.shopInfoForm.value.description,
      };

      console.log(shop)

      this.shopService.update(shop).subscribe({
        next: (res) => {
          if (this.avatar) {
            this.userService.updateAvatar(this.avatar).subscribe({
              next: (data) => {
                console.log(data);
              },
              error: (err) => {
                console.log(err);
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to update avatar',
                  icon: 'error',
                });
              },
            });
          }

          Swal.fire({
            title: 'Successfully!',
            text: 'Cập nhật thông tin thành công',
            icon: 'success',
            showLoaderOnConfirm: true,
            showClass: {
              popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp',
            },
          });
        },
        error: (err) => console.log(err),
      });
    } else {
      const customer = {
        id: this.customerInfoForm.value.id,
        name: this.customerInfoForm.value.name,
        address: this.customerInfoForm.value.address,
        phoneNumber: this.customerInfoForm.value.phoneNumber,
        dob: this.customerInfoForm.value.dob,
      };

      console.log(customer);

      this.customerService.update(customer).subscribe({
        next: (res) => {
          if (this.avatar) {
            this.userService.updateAvatar(this.avatar).subscribe({
              next: (data) => {
                console.log(data);
              },
              error: (err) => {
                console.log(err);
                this.toastr.error("Đã xảy ra lỗi: ", err);
              },
            });
          }

          Swal.fire({
            title: 'Successfully!',
            text: 'Cập nhật thông tin thành công',
            icon: 'success',
            showLoaderOnConfirm: true,
            showClass: {
              popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp',
            },
          });
        },
        error: (err) => console.log(err),
      });
    }
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      console.log(this.changePasswordForm.value);
      const oldPass = this.changePasswordForm.value.oldPassword;
      const newPass = this.changePasswordForm.value.newPassword;
      const confirmPass = this.changePasswordForm.value.confirmPassword;
      if (newPass !== confirmPass) {
        this.toastr.error('Mật khẩu mới không khớp', 'Lỗi');
      } else {
        this.authService.changePassword(oldPass, newPass).subscribe({
          next: (res) => {
            console.log(res);
            Swal.fire({
              title: 'Successfully!',
              text: 'Thay đổi mật khẩu thành công',
              icon: 'success',
              showLoaderOnConfirm: true,
              showClass: {
                popup: 'animate__animated animate__fadeInDown',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
              },
            }).then((res) => {
              this.changePasswordForm.reset();
            });
          },
          error: (err) => {
            console.log(err.error.message);
            this.toastr.error(err.error.message);
          },
        });
      }
    }
  }
}
