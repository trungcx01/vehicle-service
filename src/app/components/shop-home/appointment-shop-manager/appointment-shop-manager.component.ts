import { AppointmentService } from '../../../services/appointment.service';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppointmentUpdateComponent } from '../appointment-update/appointment-update.component';
import Swal from 'sweetalert2';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-appointment-shop-manager',
  templateUrl: './appointment-shop-manager.component.html',
  styleUrl: './appointment-shop-manager.component.scss'
})
export class AppointmentShopManagerComponent implements OnInit{
  appointments: any;
  constructor(private appointmentService: AppointmentService, private toastr: ToastrService,
    private modalService: NgbModal,
    private paymentService: PaymentService
  ){}

  ngOnInit(): void {
      this.appointmentService.getByCurrentShop().subscribe({
        next: (response) => {
          Promise.all(
            response.map(async (res: any) => {
              const status = await this.getPaymentStatus(res.id);
              console.log(status);
              return {
                ...res,
                paymentStatus: status,
              };
             
         
            })
          ).then((appointmentsWithStatus) => {
            this.appointments = appointmentsWithStatus;
            console.log(this.appointments);
          }).catch((error) => {
            console.error("Error while fetching appointments: ", error);
          });
        },
        error: (err) => console.log(err)
      })
  }

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
}
