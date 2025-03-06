import { EmergencyRequestService } from '../../../services/emergency-request.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CustomerService } from '../../../services/customer.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OthersService } from '../../../services/others.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emergency-request',
  templateUrl: './emergency-request.component.html',
  styleUrl: './emergency-request.component.scss',
})
export class EmergencyRequestComponent implements OnInit {
  customer: any;
  form: any;
  previewFiles: any;
  images: any[] = [];
  addressOptions: any;
  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private emergencyRequestService: EmergencyRequestService,
    private router: Router,
    private othersService: OthersService
  ) {
    this.form = this.fb.group({
      vehicleType: ['', Validators.required],
      licensePlate: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCurrentCustomer();
  }
  getCurrentCustomer() {
    this.customerService.getCurrentCustomer().subscribe({
      next: (res) => {
        console.log(res);
        this.customer = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.othersService
          .fromLatLngToAddress(
            position.coords.latitude,
            position.coords.longitude
          )
          .subscribe({
            next: (res : any) => {
              this.form.patchValue({
                location: res.results[0].formatted_address,
              })
              console.log(res);
            },
            error: (err) => {
              console.log(err);
            },
          });
      });
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 3) {
      alert('Bạn chỉ có thể chọn tối đa 3 hình ảnh.');
      event.target.value = ''; // Reset input nếu chọn quá 3 tệp
      return;
    }
    this.images = files;
    this.previewFiles = [];
    if (files && files.length) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewFiles.push(e.target.result);
        };
        reader.readAsDataURL(file); // sau khi đọc file xong thì sẽ lưu dạng base64 về e.target.result ở dòng 51
      }
    }
  }

  onItemChange(input: any) {
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

  onSubmit() {
    const formValue = {
      vehicleType: this.form.value.vehicleType,
      licensePlate: this.form.value.licensePlate,
      description: this.form.value.description,
      location: this.form.value.location,
      customerId: this.customer.id,
    };

    console.log(this.images[0], this.images[1], this.images[2]);
    this.emergencyRequestService
      .createEmergencyRequest(
        this.images[0],
        this.images[1] || null,
        this.images[2] || null,
        formValue
      )
      .subscribe({
        next: (res) => {
          console.log('0ok', res);
          this.router.navigate(['/proposal-list', res.id]);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
