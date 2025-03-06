import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { NotificationComponent } from './components/user/notification/notification.component';
import { MapComponent } from './components/customer/map/map.component';
import { HomeComponent } from './components/customer/home/home.component';
import { ShopDetailComponent } from './components/customer/shop-detail/shop-detail.component';
import { ShopHomeComponent } from './components/shop-home/shop-home.component';
import { ServiceManagerComponent } from './components/shop-home/service-manager/service-manager.component';
import { AppointmentShopManagerComponent } from './components/shop-home/appointment-shop-manager/appointment-shop-manager.component';
import { RegistrationInfoComponent } from './components/user/registration-info/registration-info.component';
import { CustomerRegisterComponent } from './components/user/customer-register/customer-register.component';
import { ShopRegisterComponent } from './components/user/shop-register/shop-register.component';
import { NgbDateParserFormatter, NgbDatepickerModule, NgbModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { authInterceptor } from './auth.interceptor';
import { CustomDateParserFormatter } from './datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { UserInfoComponent } from './components/user/user-info/user-info.component';
import { AppointmentComponent } from './components/customer/appointment/appointment.component';
import { AppointmentHistoryComponent } from './components/customer/appointment-history/appointment-history.component';
import { PaymentComponent } from './components/customer/payment/payment.component';
import { PaymentSuccessComponent } from './components/customer/payment-success/payment-success.component';
import { EmergencyRequestComponent } from './components/customer/emergency-request/emergency-request.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EmergencyRequestListComponent } from './components/shop-home/emergency-request-list/emergency-request-list.component';
import { ProposalComponent } from './components/shop-home/proposal/proposal.component';
import { ProposalListComponent } from './components/customer/proposal-list/proposal-list.component';
import { UnauthorizedComponent } from './components/user/unauthorized/unauthorized.component';
import { loadingInterceptor } from './loading.interceptor';
import { ShopListComponent } from './components/customer/shop-list/shop-list.component';
import { ServiceUpdateComponent } from './components/shop-home/service-update/service-update.component';
import { AppointmentUpdateComponent } from './components/shop-home/appointment-update/appointment-update.component';
import { ShopMapComponent } from './components/shop-home/shop-map/shop-map.component';
import { ShopStatisticComponent } from './components/shop-home/shop-statistic/shop-statistic.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { ReviewComponent } from './components/customer/review/review.component';
import { EmergencyRequestCustomerComponent } from './components/customer/emergency-request-customer/emergency-request-customer.component';
import { CustomerManagementComponent } from './components/admin/customer-management/customer-management.component';
import { ShopManagementComponent } from './components/admin/shop-management/shop-management.component';
import { VehicleCareManagementComponent } from './components/admin/vehicle-care-management/vehicle-care-management.component';
import { AppointmentManagementComponent } from './components/admin/appointment-management/appointment-management.component';
import { EmergencyRequestManagementComponent } from './components/admin/emergency-request-management/emergency-request-management.component';
import { ReviewManagementComponent } from './components/admin/review-management/review-management.component';
import { AdminStatisticComponent } from './components/admin/admin-statistic/admin-statistic.component';
import { AdminComponentComponent } from './components/admin/admin-component/admin-component.component';
import { ReviewManagerComponent } from './components/shop-home/review-manager/review-manager.component';
import { NotificationListComponent } from './components/user/notification-list/notification-list.component';
import { ImageModalComponent } from './image-modal/image-modal.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    MapComponent,
    HomeComponent,
    ShopDetailComponent,
    ShopHomeComponent,
    ServiceManagerComponent,
    RegistrationInfoComponent,
    CustomerRegisterComponent,
    ShopRegisterComponent,
    UserInfoComponent,
    AppointmentComponent,
    AppointmentHistoryComponent,
    PaymentComponent,
    PaymentSuccessComponent,
    EmergencyRequestComponent,
    EmergencyRequestListComponent,
    ProposalComponent,
    ProposalListComponent,
    UnauthorizedComponent,
    ShopListComponent,
    ServiceUpdateComponent,
    AppointmentUpdateComponent,
    ShopMapComponent,
    ShopStatisticComponent,
    ForgotPasswordComponent,
    ReviewComponent,
    EmergencyRequestCustomerComponent,
    CustomerManagementComponent,
    ShopManagementComponent,
    VehicleCareManagementComponent,
    AppointmentManagementComponent,
    AppointmentShopManagerComponent,
    EmergencyRequestManagementComponent,
    ReviewManagementComponent,
    AdminStatisticComponent,
    AdminComponentComponent,
    ReviewManagerComponent,
    NotificationListComponent,
    ImageModalComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CanvasJSAngularChartsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right' // Change to your desired position
    
    }),
    SweetAlert2Module.forRoot(),
    NgSelectModule,
    NgbDatepickerModule,
    NgxMaterialTimepickerModule,
  ],
  
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: authInterceptor,
      multi: true
    },
    provideHttpClient(withInterceptors([loadingInterceptor])),
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    provideAnimationsAsync('noop'),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
