import { NotificationService } from './../../services/notification.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLogin: boolean = false; // Trạng thái đăng nhập
  name: string = 'Login'; // Tên nút (Login hoặc Logout)
  url: string = '/login'; // Đường dẫn của nút (Login hoặc Logout)
  notifications: any[] = [];
  countUnread: any;
  isPopupVisible = true;
  publicSubject = new Subject<string>();

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.notificationService.getNotifications().subscribe({
      next: (notification) => {
        if (notification.startsWith('NOTIFICATION')) {
          this.toastr.success(notification.substring(14));
         this.getUnreadNoti();
         this.getByCurrentUser();
        }
      },
      error: (error) => console.log(error),
    });

    this.getUnreadNoti();
    this.getByCurrentUser();
  }

  onSearch(){
    console.log("dcr")
  }

  navToShopList(){
    this.router.navigate(['/shop-list']);
  }
  getByCurrentUser(){
    this.notificationService.getByCurrentUser().subscribe({
      next: (res: any) => {
        this.notifications = res;
      },
      error: (error) => console.log(error),
    });
  }
  getUnreadNoti() {
    this.notificationService.getUnreadOfCurrentUser().subscribe({
      next: (res: any) => (this.countUnread = res.length),
      error: (error) => console.log(error),
    });
  }
  navToAppointment() {
    this.router.navigate(['appointment-history']);
  }

  navToEmergencyRequest() {
    this.router.navigate(['emergency-request']);
  }
  checkLoginStatus(): void {
    const token = localStorage.getItem('token') ?? '';
    if (token) {
      this.isLogin = true;
      this.name = 'Logout';
      this.url = '/logout';
    } else {
      this.isLogin = false;
      this.name = 'Login';
      this.url = '/login';
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLogin = false;
    this.name = 'Login';
    this.url = '/login';
    this.toastr.success('Đăng xuất thành công!');
    this.router.navigate([this.url]);
  }
  toggleNotificationPopup() {
    this.isPopupVisible = true;
  }

  markAllAsRead(event: any) {}
}
