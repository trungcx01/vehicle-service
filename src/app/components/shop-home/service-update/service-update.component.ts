import { VehicleCareService } from './../../../services/vehicle-care.service';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-service-update',
  templateUrl: './service-update.component.html',
  styleUrl: './service-update.component.scss',
})
export class ServiceUpdateComponent {
  vehicleCareForm!: FormGroup;
  @Input() vehicleCare: any;
  previewFile: any;
  image: any;

  constructor(
    private fb: FormBuilder,
    private vehicleCareService: VehicleCareService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.vehicleCareForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      description: [''],
      price: [null, [Validators.required]],
      estimatedDuration: ['', [Validators.required]],
      available: [true],
    });
  }

  ngOnInit(): void {
    if (this.vehicleCare) {
      this.vehicleCareForm.patchValue({
        id: this.vehicleCare.id,
        name: this.vehicleCare.name,
        description: this.vehicleCare.description,
        price: this.vehicleCare.price,
        estimatedDuration: this.vehicleCare.estimatedDuration,
        available: this.vehicleCare.available,
      });
      this.previewFile = this.vehicleCare.imageUrl;
      this.image = this.vehicleCare.imageUrl;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.image = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewFile = (e.target.result);
        };
        reader.readAsDataURL(file); // sau khi đọc file xong thì sẽ lưu dạng base64 về e.target.result ở dòng 51
    }
  

  onSubmit() {
    if (!this.vehicleCare) {
      this.vehicleCareService.create(this.vehicleCareForm.value, this.image).subscribe({
        next: (data) => {
          console.log(data);
          this.toastr.success('Thêm mới thành công');
          setTimeout(()=>{
            this.activeModal.close();
            window.location.reload();
          }, 1500)
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Có lỗi rồi!');
        },
      });
    } else {
  
      this.vehicleCareService.update(this.vehicleCareForm.value, this.image).subscribe({
        next: (data) => {
          console.log(data);
         
          this.toastr.success('Cập nhật thành công');
         
          setTimeout(()=>{
            this.activeModal.close();
            window.location.reload();
          }, 1500)
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Có lỗi rồi!');
        },
      });
    }
  }
}
