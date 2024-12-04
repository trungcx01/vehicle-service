import { VehicleCareService } from './../../../services/vehicle-care.service';
import { AppointmentService } from './../../../services/appointment.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Util } from '../../../util';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-appointment-update',
  templateUrl: './appointment-update.component.html',
  styleUrl: './appointment-update.component.scss'
})
export class AppointmentUpdateComponent implements OnInit{
  @Input() appointment: any;
  vehicleCares: any[] = [];
  appointmentForm!: FormGroup;

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService, private vehicleCareService: VehicleCareService,
    private toastr: ToastrService, private activeModal: NgbActiveModal, private util: Util, private customerService: CustomerService
  ){
    this.appointmentForm = this.fb.group({
      id: [null],
      date: ['', Validators.required],
      time: ['', Validators.required],
      vehicleType: ['', Validators.required],
      note: ['', Validators.required],
      vehicleCareIds: this.fb.group({}),
      customerId: ['', Validators.required]
    })
  }

  async ngOnInit(): Promise<void> {
      this.vehicleCares = await this.getVehicleCares();
      const vehicleCareForm = this.appointmentForm.get("vehicleCareIds") as FormGroup;
      this.vehicleCares.map((v: any) =>{
        vehicleCareForm.addControl(v.id, this.fb.control(false));
      })
  }

  async getVehicleCares(): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.vehicleCareService.getByCurrentShop().subscribe({
        next: (res) => {
          console.log(res);
          resolve(res);
        },
        error: (err) => {
          console.error(err);
          reject(err);
        }
      })
    }) 
  }

  async getCustomerByPhone(phoneNumber: string): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.customerService.getByPhone(phoneNumber).subscribe({
        next: (res) => {
          console.log(res);
          resolve(res);
        },
        error: (err) => {
          console.error(err);
          reject(err);
        }
      })
    }) 
  }


  async onSubmit(){
    const customer = await this.getCustomerByPhone(this.appointmentForm.value.customerId);
      const appointment = {
        ...this.appointmentForm.value,
        customerId: customer.id,
        date: this.util.convertDate(this.appointmentForm.value.date),
        vehicleCareIds: Object.keys(this.appointmentForm.value.vehicleCareIds).filter((v) => this.appointmentForm.get(`vehicleCareIds.${v}`)?.value === true)
      }
      console.log(appointment);
      this.appointmentService.createAppointment(appointment).subscribe({
        next: (res) => {
          console.log(res);
          this.toastr.success('Thêm mới thành công');
          setTimeout(()=>{
            this.activeModal.close();
            window.location.reload();
          }, 1500)
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Có lỗi rồi!');
        }
      })
  }
}
