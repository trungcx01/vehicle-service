import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HeaderComponent } from './layouts/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { ShopDetailComponent } from './components/shop-detail/shop-detail.component';
import { ShopHomeComponent } from './components/shop-home/shop-home.component';
import { ServiceManagerComponent } from './components/shop-home/service-manager/service-manager.component';
import { AppointmentManagerComponent } from './components/shop-home/appointment-manager/appointment-manager.component';
import { MapComponent } from './components/map/map.component';
import { RegistrationInfoComponent } from './components/registration-info/registration-info.component';
import { CustomerRegisterComponent } from './components/customer-register/customer-register.component';
import { ShopRegisterComponent } from './components/shop-register/shop-register.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { AppointmentHistoryComponent } from './components/appointment-history/appointment-history.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { EmergencyRequestComponent } from './components/emergency-request/emergency-request.component';
import { EmergencyRequestListComponent } from './components/shop-home/emergency-request-list/emergency-request-list.component';
import { ProposalListComponent } from './components/proposal-list/proposal-list.component';
import { roleGuard } from './guards/role.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { authGuard } from './guards/auth.guard';
import { ShopListComponent } from './components/shop-list/shop-list.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ShopMapComponent } from './components/shop-map/shop-map.component';

const routes: Routes = [
  // Các đường dẫn cho tất cả người dùng (CUSTOMER, SHOP, ADMIN)
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', component: HomeComponent },
  { 
    path: 'registration-info', 
    component: RegistrationInfoComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['USER'] } 
  },
  { 
    path: 'customer-register', 
    component: CustomerRegisterComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['USER'] } 
  },

  // Các đường dẫn dành cho CUSTOMER
  { 
    path: 'shop-detail/:id', 
    component: ShopDetailComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['CUSTOMER'] } 
  },
 
  { 
    path: 'info', 
    component: UserInfoComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['CUSTOMER'] } 
  },
  { 
    path: 'appointment-history', 
    component: AppointmentHistoryComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['CUSTOMER'] } 
  },
  { 
    path: 'payment/:id', 
    component: PaymentComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['CUSTOMER'] } 
  },
  { 
    path: 'payment-success/:id', 
    component: PaymentSuccessComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['CUSTOMER'] } 
  },
  { 
    path: 'emergency-request', 
    component: EmergencyRequestComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['CUSTOMER'] } 
  },
  { 
    path: 'map-emergency/:proposalId', 
    component: MapComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['CUSTOMER'] } 
  },
  { 
    path: 'proposal-list/:erId', 
    component: ProposalListComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['CUSTOMER'] } 
  },
  { 
    path: 'shop-list', 
    component: ShopListComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['CUSTOMER'] } 
  },

  // Các đường dẫn dành cho SHOP
  {
    path: 'shop-home', 
    component: ShopHomeComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['SHOP'] },
    children: [
      {
        path: '', 
        redirectTo: 'services', 
        pathMatch: 'full'
      },
      {
        path: 'services',
        component: ServiceManagerComponent,
        canActivate: [roleGuard],
        data: { roles: ['SHOP'] }
      },
      {
        path: 'appointments',
        component: AppointmentManagerComponent,
        canActivate: [roleGuard],
        data: { roles: ['SHOP'] }
      },
      {
        path: 'emergency-request-list',
        component: EmergencyRequestListComponent,
        canActivate: [roleGuard],
        data: { roles: ['SHOP'] }
      },
      {
        path: 'map-emergency/:proposalId',
        component: ShopMapComponent,
        canActivate: [roleGuard],
        data: { roles: ['SHOP'] }
      },
      {
        path: 'info',
        component: UserInfoComponent,
        canActivate: [roleGuard],
        data: { roles: ['SHOP'] }
      },
      { path: 'unauthorized', component: UnauthorizedComponent },
    ]
  },

  {
    path: 'admin', 
    component: DashboardComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['CUSTOMER'] },
    children: [
      {
        path: '', 
        redirectTo: 'services', 
        pathMatch: 'full'
      },
      { path: 'unauthorized', component: UnauthorizedComponent },
    ]
  },

  // Các đường dẫn dành cho ADMIN (nếu có)
 
  { 
    path: 'shop-register', 
    component: ShopRegisterComponent, 
    canActivate: [roleGuard], 
    data: { roles: ['USER'] } 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
