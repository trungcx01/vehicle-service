import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.scss'
})
export class CustomerManagementComponent implements OnInit {
  customers: any[] = [];

  constructor(private customerService: CustomerService,
    private userService: UserService,
     private toastr: ToastrService){}

  ngOnInit(): void {
    this.customerService.getAll().subscribe({
      next: (response) => {
        this.customers = response.content;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })
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
