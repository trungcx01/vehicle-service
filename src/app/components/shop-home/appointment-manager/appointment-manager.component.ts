import { AppointmentService } from './../../../services/appointment.service';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppointmentUpdateComponent } from '../appointment-update/appointment-update.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-manager',
  templateUrl: './appointment-manager.component.html',
  styleUrl: './appointment-manager.component.scss'
})
export class AppointmentManagerComponent implements OnInit{
  appointments: any;
  constructor(private appointmentService: AppointmentService, private toastr: ToastrService,
    private modalService: NgbModal
  ){}

  ngOnInit(): void {
      this.appointmentService.getByCurrentShop().subscribe({
        next: (res) =>{
          console.log(res);
          this.appointments = res;
        },
        error: (err) => console.log(err)
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
