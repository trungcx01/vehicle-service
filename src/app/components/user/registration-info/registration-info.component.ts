import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration-info',
  templateUrl: './registration-info.component.html',
  styleUrl: './registration-info.component.scss'
})
export class RegistrationInfoComponent {
  user_type: any;
  constructor(private router: Router, private toastr: ToastrService){}

  setUserType(type: string){
    this.user_type = type;
  }

  nextPage(){
    if (this.user_type === 'c'){
      this.router.navigate(['/customer-register']);
    } else if (this.user_type === 's'){
      this.router.navigate(['/shop-register']);
    } else{
      this.toastr.error('Vui lòng chọn loại tài khoản muốn đăng kí');
    }
  }
}
