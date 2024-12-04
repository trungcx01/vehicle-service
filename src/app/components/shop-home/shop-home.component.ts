import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop-home',
  templateUrl: './shop-home.component.html',
  styleUrl: './shop-home.component.scss'
})
export class ShopHomeComponent {
  isMobileView: boolean = false;
  isSidebarOpen: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 992) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  constructor(private toastr: ToastrService, private router: Router){

  }
  logout(): void {
    localStorage.removeItem('token');   
    this.toastr.success('Đăng xuất thành công!');
    this.router.navigate(['/login']);  
  }
}
