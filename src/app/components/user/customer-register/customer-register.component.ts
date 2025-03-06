import { CustomerService } from '../../../services/customer.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OthersService } from '../../../services/others.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CustomDateParserFormatter } from '../../../datepicker';
import { Router } from '@angular/router';
import { Util } from '../../../util';
declare var goongjs: any;
declare var GoongGeocoder: any;

@Component({
  selector: 'app-customer-register',
  templateUrl: './customer-register.component.html',
  styleUrl: './customer-register.component.scss',
})
export class CustomerRegisterComponent implements OnInit {
  address: any;
  addressOptions: any[] = [];
  customerForm: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private othersService: OthersService,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router, 
    private util: Util
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      dob: ['', Validators.required],
      district: ['', Validators.required]
    });
  }
ngOnInit(): void {
    
}

onChange(e: any){
  this.customerForm.patchValue({
    district: e.compound.district,
  })
}

  onSearch(input: any) {
    this.othersService.autocomplete(input.term).subscribe({
      next: (data: any) => {
        console.log('Dữ liệu trả về:', data);
        if (data.predictions) {
          this.addressOptions = data.predictions;
        } else {
          this.addressOptions = []; 
        }
      },
      error: (err) => {
        console.log('Lỗi:', err);
      },
    });
  }

  submit(){
    const token = localStorage.getItem("token");
    
    const value = {
      name: this.customerForm.value.name,
      phoneNumber: this.customerForm.value.phoneNumber,
      address: this.customerForm.value.address,
      dob: this.util.convertDate( this.customerForm.value.dob)
    }
    this.customerService.createCustomer(value).subscribe({
      next: (res) =>{
        console.log('Dữ liệu trả về:', res);
        this.toastr.success("Đăng kí thành công!")
        this.router.navigate([''])
      },
      error: (err) =>{
        console.log('Lỗi:', err);
      }
    })
  }

}
