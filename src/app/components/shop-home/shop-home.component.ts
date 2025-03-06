import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop-home',
  templateUrl: './shop-home.component.html',
  styleUrl: './shop-home.component.scss'
})
export class ShopHomeComponent implements OnInit{
  isCollapsed = false; 
  screenWidth!: number;

  

  constructor(public router: Router, private toastr: ToastrService) {}
  ngOnInit(): void {
    this.checkScreenSize();
    if (this.router.url.includes("/map-emergency")){

      this.isCollapsed = true
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed; 
  }
  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.screenWidth = window.innerWidth;
    this.isCollapsed = this.screenWidth <= 800; 
  }

  logout(): void {
    localStorage.removeItem('token');   
    this.toastr.success('Đăng xuất thành công!');
    this.router.navigate(['/login']);  
  }
}
