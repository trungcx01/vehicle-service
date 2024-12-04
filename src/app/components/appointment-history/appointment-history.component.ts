import { AppointmentService } from './../../services/appointment.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.scss',
})
export class AppointmentHistoryComponent implements OnInit {
  appointments: any[] = [];

  constructor(
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.appointmentService.getAppointmentByCurrentCustomer().subscribe({
      next: (response) => {
        this.appointments = response;
        console.log(this.appointments);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  navToPayment(id: number) {
    this.router.navigate(['/payment', id]);
  }

  cancel(id: number) {
    Swal.fire({
      title: 'Warning',
      text: 'Bạn có chắc chắn muốn hủy Lịch hẹn?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hủy lịch hẹn',
      cancelButtonText: 'Trở về',
    }).then((result) => {
      this.appointmentService.updateStatus(id, 'CANCELED').subscribe({
        next: (response) => {
          console.log(response);
          Swal.fire({
            title: 'Successfully!',
            text: 'Hủy lịch hẹn thành công',
            icon: 'success',
            showLoaderOnConfirm: true,
            showClass: {
              popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
    });
  }
}
