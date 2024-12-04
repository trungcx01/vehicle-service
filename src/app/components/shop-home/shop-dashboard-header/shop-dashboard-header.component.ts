import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-dashboard-header',
  templateUrl: './shop-dashboard-header.component.html',
  styleUrl: './shop-dashboard-header.component.scss'
})
export class ShopDashboardHeaderComponent {
  constructor(private router: Router){}
  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
