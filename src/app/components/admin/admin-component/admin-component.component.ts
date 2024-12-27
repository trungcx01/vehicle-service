import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-component',
  templateUrl: './admin-component.component.html',
  styleUrl: './admin-component.component.scss'
})
export class AdminComponentComponent {
  isCollapsed = false; 

  constructor(public router: Router, private toastr: ToastrService) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed; 
  }

  logout(): void {
    localStorage.removeItem('token');   
    this.toastr.success('Đăng xuất thành công!');
    this.router.navigate(['/login']);  
  }
}
