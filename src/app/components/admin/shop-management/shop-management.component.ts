import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../../services/shop.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-shop-management',
  templateUrl: './shop-management.component.html',
  styleUrl: './shop-management.component.scss'
})
export class ShopManagementComponent implements OnInit {
  shops: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalRecords: number = 0;
  private searchSubject: Subject<string> = new Subject<string>();

  constructor(private shopService: ShopService, private toastr: ToastrService, private userService: UserService) {}

  ngOnInit(): void {
    this.getShops();
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        if (searchTerm) {
          this.searchShops();
        } else {
          this.getShops();
        }
      });
  }

  getShops(): void {
    this.shopService.getAll(this.currentPage - 1, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.shops = response.content;
        this.totalRecords = response.totalElements;
      },
      error: (error) => {
        console.error('Error fetching shops:', error);
      },
    });
  }

  searchShops(): void {
    this.shopService
      .searchShops(this.currentPage - 1, this.itemsPerPage, this.searchTerm)
      .subscribe({
        next: (response: any) => {
          this.shops = response.content;
          this.totalRecords = response.totalElements;
        },
        error: (error) => {
          console.error('Error searching shops:', error);
        },
      });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getShops();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getShops();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.itemsPerPage);
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