import { CustomerService } from './../../services/customer.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OthersService } from '../../services/others.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CustomDateParserFormatter } from '../../datepicker';
import { Router } from '@angular/router';
import { ShopService } from '../../services/shop.service';
declare var goongjs: any;
declare var GoongGeocoder: any;

@Component({
  selector: 'app-shop-register',
  templateUrl: './shop-register.component.html',
  styleUrl: './shop-register.component.scss',
})
export class ShopRegisterComponent implements OnInit {
  address: any;
  addressOptions: any[] = [];
  shopForm: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private othersService: OthersService,
    private shopService: ShopService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.shopForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['' , Validators.required],
      description: ['', Validators.required],
      openHour: ['', Validators.required],
      closeHour: ['', Validators.required],
      district: ['', Validators.required]
    });
  }
ngOnInit(): void {
    
}

onChange(e: any){
  this.shopForm.patchValue({
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
    console.log(this.shopForm.value)
    this.shopService.createShop(this.shopForm.value).subscribe({
      next: (res) =>{
        console.log('Dữ liệu trả về:', res);
        this.toastr.success("Đăng kí thành công!")
        this.router.navigate(['shop-home'])
      },
      error: (err) =>{
        console.log('Lỗi:', err);
      }
    })
  }

}
