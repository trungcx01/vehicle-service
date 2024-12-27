import { EmergencyRequestService } from './../../services/emergency-request.service';
import { ActivatedRoute } from '@angular/router';
import { ProposalService } from './../../services/proposal.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notification',
  template: `
    <!-- <h4>OKLnded</h4>
      <div *ngIf="notifications.length > 0" class="alert alert-success text-center">
          <h3>Login Notifications</h3>
          <ul>
              <li *ngFor="let notification of notifications">{{ notification }}</li>
          </ul>
      </div> -->
  `,
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: string[] = [];
  private notificationSubscription!: Subscription;

  constructor(
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private proposalService: ProposalService,
    private emergencyRequestService: EmergencyRequestService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.notificationService.connect();
    this.notificationSubscription = this.notificationService
      .getNotifications()
      .subscribe((notification: string) => {
        console.log('o', notification);
        if (notification.startsWith('PROPOSAL')) {
          this.toastr.success('Có cửa hàng đã gửi đề xuất đến bạn');
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else if (notification.startsWith('ACCEPTED_PROPOSAL')) {
          this.toastr.success(notification);
          Swal.fire({
            title: 'Đề xuất của bạn đã được chấp nhận. Hãy bắt đầu ngay thôi!',
            icon: 'success',
            confirmButtonText: 'Bắt đầu',
            timer: 2000,
          }).then((result) => {
            if (
              result.isConfirmed ||
              result.dismiss === Swal.DismissReason.timer
            ) {
              const split = notification.split(' ');
              const proposalId = split[1];
              const emergencyRequestId = Number(split[4]);
              this.updateEmergencyRequestStatus("IN_PROGRESS", emergencyRequestId);
              window.location.href = 'shop-home/map-emergency/' + proposalId;
            }
          });
        } else if (notification.startsWith('EMERGENCY_REQUEST')) {
          Swal.fire({
            title: 'Có Khách hàng đang yêu cầu cứu trợ khẩn cấp!',
            icon: 'warning',
            confirmButtonText: 'Xem chi tiết',
            confirmButtonColor: '#4CAF50',
            background: '#ffffff',
            customClass: {
              title: 'swal-title',
              confirmButton: 'swal-btn',
            },
          }).then((result) => {
            if (
              result.isConfirmed ||
              result.dismiss === Swal.DismissReason.timer
            ) {
              window.location.href = '/shop-home/emergency-request-list';
            }
          });
        }  

        this.notifications.push(notification);
      });
  }

  ngOnDestroy(): void {
    // Check if notificationSubscription is defined before unsubscribing
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    this.notificationService.disconnect();
  }

  updateEmergencyRequestStatus(status: any, emergencyRequestId: number){
    this.emergencyRequestService.updateStatus(status, emergencyRequestId).subscribe({
      next: (res) =>{},
      error: (err) =>{
        console.log(err);
      }
    })
  }
}
