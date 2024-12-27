import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop-home',
  templateUrl: './shop-home.component.html',
  styleUrl: './shop-home.component.scss'
})
export class ShopHomeComponent {
  isCollapsed = false; // State to toggle the sidebar

  constructor(public router: Router, private toastr: ToastrService) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed; // Toggle sidebar state
  }

  logout(): void {
    localStorage.removeItem('token');   
    this.toastr.success('Đăng xuất thành công!');
    this.router.navigate(['/login']);  
  }
}
