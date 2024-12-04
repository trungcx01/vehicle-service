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
import { ActivationComponent } from './components/auth/activation/activation.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { NotificationComponent } from './components/notification/notification.component';
import { MapComponent } from './components/map/map.component';
import { HomeComponent } from './components/home/home.component';
import { ShopDetailComponent } from './components/shop-detail/shop-detail.component';
import { ShopHomeComponent } from './components/shop-home/shop-home.component';
import { ServiceManagerComponent } from './components/shop-home/service-manager/service-manager.component';
import { AppointmentManagerComponent } from './components/shop-home/appointment-manager/appointment-manager.component';
import { RegistrationInfoComponent } from './components/registration-info/registration-info.component';
import { CustomerRegisterComponent } from './components/customer-register/customer-register.component';
import { ShopRegisterComponent } from './components/shop-register/shop-register.component';
import { NgbDateParserFormatter, NgbDatepickerModule, NgbModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { authInterceptor } from './auth.interceptor';
import { CustomDateParserFormatter } from './datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { AppointmentHistoryComponent } from './components/appointment-history/appointment-history.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { EmergencyRequestComponent } from './components/emergency-request/emergency-request.component';
import { NotificationPopupComponent } from './components/notification-popup/notification-popup.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EmergencyRequestListComponent } from './components/shop-home/emergency-request-list/emergency-request-list.component';
import { ProposalComponent } from './components/shop-home/proposal/proposal.component';
import { ProposalListComponent } from './components/proposal-list/proposal-list.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ShopDashboardHeaderComponent } from './components/shop-home/shop-dashboard-header/shop-dashboard-header.component';
import { loadingInterceptor } from './loading.interceptor';
import { ShopListComponent } from './components/shop-list/shop-list.component';
import { ServiceUpdateComponent } from './components/shop-home/service-update/service-update.component';
import { AppointmentUpdateComponent } from './components/shop-home/appointment-update/appointment-update.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ShopMapComponent } from './components/shop-map/shop-map.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ActivationComponent,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    MapComponent,
    HomeComponent,
    ShopDetailComponent,
    ShopHomeComponent,
    ServiceManagerComponent,
    AppointmentManagerComponent,
    RegistrationInfoComponent,
    CustomerRegisterComponent,
    ShopRegisterComponent,
    UserInfoComponent,
    AppointmentComponent,
    AppointmentHistoryComponent,
    PaymentComponent,
    PaymentSuccessComponent,
    EmergencyRequestComponent,
    NotificationPopupComponent,
    EmergencyRequestListComponent,
    ProposalComponent,
    ProposalListComponent,
    UnauthorizedComponent,
    ShopDashboardHeaderComponent,
    ShopListComponent,
    ServiceUpdateComponent,
    AppointmentUpdateComponent,
    DashboardComponent,
    ShopMapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
