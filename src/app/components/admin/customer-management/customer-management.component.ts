import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.scss'
})
export class CustomerManagementComponent implements OnInit {
  customers: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10; 
  totalRecords: number = 0; 
  private searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private customerService: CustomerService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCustomers();


    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.currentPage = 1; 
        if (searchTerm) {
          this.searchCustomers();
        } else {
          this.getCustomers();
        }
      });
  }


  getCustomers(): void {
    this.customerService
      .getAll(this.currentPage - 1, this.itemsPerPage)
      .subscribe({
        next: (response: any) => {
          this.customers = response.content;
          this.totalRecords = response.totalElements;
        },
        error: (error) => {
          console.error('Error fetching customers:', error);
          this.toastr.error('Lỗi khi tải danh sách khách hàng!');
        },
      });
  }


  searchCustomers(): void {
    this.customerService
      .searchCustomers(this.currentPage - 1, this.itemsPerPage, this.searchTerm)
      .subscribe({
        next: (response: any) => {
          this.customers = response.content;
          this.totalRecords = response.totalElements;
        },
        error: (error) => {
          console.error('Error searching customers:', error);
          this.toastr.error('Lỗi khi tìm kiếm khách hàng!');
        },
      });
  }


  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }


  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.searchTerm ? this.searchCustomers() : this.getCustomers();
    }
  }


  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchTerm ? this.searchCustomers() : this.getCustomers();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.itemsPerPage);
  }
  addCustomer(): void {
    alert('Add customer functionality not implemented yet.');
  }


    deleteCustomer(id: number): void {
      Swal.fire({
        title: 'Bạn chắc chắn chứ?',
        text: 'Bạn sẽ không thể khôi phục khách hàng này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Có, xóa nó!',
      }).then((result) => {
        if (result.isConfirmed) {

          this.customerService.delete(id).subscribe(
            () => {
              this.customers = this.customers.filter((customer: any) => customer.id !== id);
              Swal.fire('Đã xóa!', 'Khách hàng đã bị xóa.', 'success');
            },
            (error) => {
              Swal.fire('Lỗi!', 'Đã có lỗi xảy ra khi xóa khách hàng.', 'error');
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
