import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../../services/shop.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-shop-management',
  templateUrl: './shop-management.component.html',
  styleUrl: './shop-management.component.scss'
})
export class ShopManagementComponent implements OnInit {
  shops: any[] = [];

  constructor(private shopService: ShopService, private toastr: ToastrService, private userService: UserService){}
  ngOnInit(): void {
    this.shopService.getAll().subscribe({
      next: (data) => {
        this.shops = data.content;
        console.log(data);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })
  }


  addShop(): void {
    alert('Chức năng thêm shop chưa được triển khai.');
  }

  deleteShop(id: number): void {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Shop này sẽ bị xóa!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.shopService.delete(id).subscribe(
          () => {
            this.shops = this.shops.filter((shop) => shop.id !== id);
            this.toastr.success("Shop đã được xóa thành công!");
          },
          (error: any) => {
           this.toastr.error("Không thể xóa shop. Vui lòng thử lại sau.");
          }
        );
      }
    });
  }

  updateStatus(userId: any, lock: boolean) {

    Swal.fire({
      title: lock ? 'Bạn có chắc chắn muốn mở khóa tài khoản này?' : 'Bạn có chắc chắn muốn khóa tài khoản này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        if (lock) {
          this.userService.unlockAccount(userId).subscribe({
            next: (response) => {
              this.toastr.success('Tài khoản đã được mở khóa thành công.', 'Thành công');
              console.log(response);
              window.location.reload();
            },
            error: (error) => {
              this.toastr.error('Đã xảy ra lỗi khi mở khóa tài khoản.', 'Lỗi');
              console.error('Error:', error);
            }
          });
        } else {
          this.userService.lockAccount(userId).subscribe({
            next: (response) => {
              this.toastr.success('Tài khoản đã được khóa thành công.', 'Thành công');
              console.log(response);
              window.location.reload();
            },
            error: (error) => {
              this.toastr.error('Đã xảy ra lỗi khi khóa tài khoản:'  + error.error.message);
              console.error('Error:', error);
            }
          });
        }
      } 
    });
  }
  
}