import { AppointmentService } from '../../../services/appointment.service';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppointmentUpdateComponent } from '../appointment-update/appointment-update.component';
import Swal from 'sweetalert2';
import { PaymentService } from '../../../services/payment.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-appointment-shop-manager',
  templateUrl: './appointment-shop-manager.component.html',
  styleUrl: './appointment-shop-manager.component.scss'
})
export class AppointmentShopManagerComponent implements OnInit{
  appointments: any[] = [];
    searchTerm: string = '';
  
    currentPage: number = 1;
      itemsPerPage: number = 10; 
      totalRecords: number = 0; 
      private searchSubject: Subject<string> = new Subject<string>();
    
      ngOnInit(): void {
        this.getAppointments();
    
    
        this.searchSubject
          .pipe(debounceTime(300), distinctUntilChanged())
          .subscribe((searchTerm) => {
            this.currentPage = 1; 
            if (searchTerm) {
              this.searchAppointments();
            } else {
              this.getAppointments();
            }
          });
      }
    
    
      getAppointments(): void {
        const page = this.currentPage - 1; 
        const size = this.itemsPerPage;    
      
        this.appointmentService.getByCurrentShop(page, size).subscribe({
          next: async (response) => {
            try {
              const appointmentsWithStatus = [];
      
              for (const res of response.content) {
                const status = await this.getPaymentStatus(res.id);
                console.log(status);
                appointmentsWithStatus.push({
                  ...res,
                  paymentStatus: status,
                });
              }
      
              this.appointments = appointmentsWithStatus.reverse();
              this.totalRecords = response.totalElements;
              console.log(this.appointments);
            } catch (error) {
              console.error(error);
            }
          },
          error: (err) => console.log(err)
        });
      }
      
    
    
      searchAppointments(): void {
        this.appointmentService
          .searchAppointments(this.currentPage - 1, this.itemsPerPage, this.searchTerm)
          .subscribe({
            next: (response: any) => {
              console.log('kdieju', response)
              this.appointments = response.content;
              this.totalRecords = response.totalElements;
            },
            error: (error: any) => {
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
          this.searchTerm ? this.searchAppointments() : this.getAppointments();
        }
      }
    
    
      previousPage(): void {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.searchTerm ? this.searchAppointments() : this.searchAppointments();
        }
      }
    
      get totalPages(): number {
        return Math.ceil(this.totalRecords / this.itemsPerPage);
      }

  constructor(private appointmentService: AppointmentService, private toastr: ToastrService,
    private modalService: NgbModal,
    private paymentService: PaymentService
  ){}


  async getPaymentStatus(id: number): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.paymentService.getPaymentByAppointment(id).subscribe({
        next: (response: any) => {
          resolve(response === null ? "PENDING" : response!.status)
        },
        error: (error) => {
          console.error(error);
          reject(error);
        }
      })
    })
  }

  openNew(){
    const modalRef = this.modalService.open(AppointmentUpdateComponent, {
      size: 'lg',
      centered: true
    })
  }


  updateStatus(appointmentId: number, status: string){
    Swal.fire({
      title: 'Warning',
      text: 'Bạn có chắc chắn muốn' + (status === 'ACCEPTED' ? ' nhận ' : (status === 'DECLINED' ? ' từ chối ' : ' hoàn thành ')) + 'lịch hẹn này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, tôi chắc chắn',
      cancelButtonText: 'Hủy',
      backdrop: true,  // Làm mờ phần nền ngoài modal
      focusConfirm: false,  // Tắt chế độ tự động focus vào nút xác nhận
      position: 'center',  // Đặt modal ở giữa màn hình
      iconColor: '#d39e00'  // Màu icon cảnh báo
      }).then((result) => {
        if (result.isConfirmed){
          this.appointmentService.updateStatus(appointmentId, status).subscribe({
            next: (res) =>{
              console.log(res);
              this.toastr.success('Cập nhật thành công');
              setTimeout(()=>{
                window.location.reload();
              }, 1200)
            },
            error: (err) => {
              console.log(err);
            }
          })
        }
      })
    
  }

  translateVehicleType(type: string): string {
    switch (type) {
      case 'XE_SO':
        return 'Xe số';
      case 'XE_TAY_GA':
        return 'Xe tay ga';
      case 'XE_CON_TAY':
        return 'Xe côn tay';
      case 'XE_PHAN_KHOI_LON':
        return 'Xe phân khối lớn';
      case 'XE_DIEN':
        return 'Xe điện';
      default:
        return 'Không xác định';
    }
  }
  
}
