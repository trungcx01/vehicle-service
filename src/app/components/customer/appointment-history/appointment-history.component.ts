import { Util } from '../../../util';
import { AppointmentService } from '../../../services/appointment.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PaymentService } from '../../../services/payment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReviewComponent } from '../review/review.component';
import { ReviewService } from '../../../services/review.service';

@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.scss',
})
export class AppointmentHistoryComponent implements OnInit {
  appointments: any[] = [];

  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private paymentService: PaymentService,
    private modalService: NgbModal,
    private reviewService: ReviewService,
    public util: Util
  ) {}

  openReviewForm(id: number){
    const modalRef = this.modalService.open(ReviewComponent, {
      size: 'md',
      centered: true
    })
    modalRef.componentInstance.appointmentId = id;
    modalRef.componentInstance.customerId=this.appointments[0].customer.id;
  }

  openReviewDetail(review: any){
    const modalRef = this.modalService.open(ReviewComponent, {
      size: 'md',
      centered: true
    })
    modalRef.componentInstance.appointmentReview = review;
  }

  async getAppointmentsByCurrentCustomer(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appointmentService.getAppointmentByCurrentCustomer().subscribe({
        next: (res: any) => resolve(res),
        error: (err: any) => reject(err),
      });
    });
  }
  
  async ngOnInit(): Promise<void> {
    try {
      const response = await this.getAppointmentsByCurrentCustomer();
      const appointments = [];
  
      for (const res of response) {
        const payment = await this.getPayment(res.id);
        const review = await this.getReviewOfAppointment(res.id);
  
        appointments.push({
          ...res,
          paymentStatus: payment?.status || '',
          paymentMethod: payment?.paymentMethod,
          review: review,
        });
      }
  
      this.appointments = appointments.reverse();
      console.log(this.appointments);
    } catch (error) {
      console.error("Error while fetching appointments: ", error);
    }
  }
  

  navToPayment(id: number) {
    this.router.navigate(['/payment', 'appointment', id]);
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

  navToShop(id: number){
    this.router.navigate(['/shop-detail', id]);
  }

  finishedAppointment(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn hoàn thành lịch hẹn này?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.updateStatus(id, "FINISHED").subscribe({
          next: (res) => {
            Swal.fire(
              'Hoàn thành!',
              'Lịch hẹn đã được đánh dấu hoàn thành.',
              'success'
            );
          },
          error: (err) => {
            Swal.fire(
              'Lỗi!',
              'Có lỗi xảy ra khi hoàn thành lịch hẹn.',
              'error'
            );
          }
        });
        window.location.reload();
      }
    });
  }
  

  async getPayment(id: number): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.paymentService.getPaymentByAppointment(id).subscribe({
        next: (response) => {
          console.log(response);
          resolve(response)
        },
        error: (error) => {
          console.error(error);
          reject(error);
        }
      })
    })
  }

  async getReviewOfAppointment(id: number): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.reviewService.getByAppointment(id).subscribe({
        next: (response) => {
          console.log(response);
          resolve(response);
        },
        error: (error) => {
          console.error(error);
          reject(error);
        }
      })
    })
  }
    
}
