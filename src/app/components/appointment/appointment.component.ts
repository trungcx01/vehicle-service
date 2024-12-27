import { AppointmentService } from './../../services/appointment.service';
import { map } from 'rxjs';
import { VehicleCareService } from './../../services/vehicle-care.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Util } from '../../util';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent implements OnInit {
  @Input() shop: any;
  @Input() vehicleCare: any;
  appointmentForm: any;
  vehicleCares: any[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private vehicleCareService: VehicleCareService, 
    private cdr: ChangeDetectorRef,
    private appointmentService: AppointmentService,
    private util: Util,
    private toastr: ToastrService, 
    private router: Router
  ) {
    
  }

  getVehicleCares() {
    this.vehicleCareService.getByShop(this.shop.id).subscribe({
      next: (res) => {
        console.log(res)
        this.vehicleCares = res;
        const vehicleCaresForm = this.appointmentForm.get("vehicleCareIds") as FormGroup;
        this.vehicleCares.map((v: any) =>{
          vehicleCaresForm.addControl(v.id, this.fb.control(false))
        })
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  ngOnInit(): void {
    if (this.vehicleCare && this.vehicleCare.id) {
      this.appointmentForm = this.fb.group({
        date: ['', Validators.required],
        time: ['', Validators.required],
        vehicleType: ['', Validators.required],
        note: ['', Validators.required],
        vehicleCareIds: this.fb.group({
          [this.vehicleCare.id]: true
        })
      });
    } else {
      this.appointmentForm = this.fb.group({
        date: ['', Validators.required],
        time: ['', Validators.required],
        vehicleType: ['', Validators.required],
        note: ['', Validators.required],
        vehicleCareIds: this.fb.group({})
      });
    }
    
    console.log(this.shop);
    this.getVehicleCares();
    this.cdr.detectChanges();
    // console.log(this.vehicleCares);

  
  }
  closeModal() {
    this.activeModal.dismiss();
  }

  submit() {
    const appointment = this.appointmentForm.value;
    console.log(appointment);
    appointment.vehicleCareIds = [];
    appointment.date = this.util.convertDate(appointment.date);
    console.log(this.appointmentForm.get("vehicleCareIds").value)
    const vehicleCaresControls = this.appointmentForm.get("vehicleCareIds").controls;
    Object.keys(vehicleCaresControls).forEach((key) => {
      if (vehicleCaresControls[key].value === true){
        appointment.vehicleCareIds.push(Number(key));
      }
    });

    this.appointmentService.createAppointment(appointment).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success("Đăng kí lịch hẹn thành công")
        this.activeModal.close(res);
        this.router.navigate(['/appointment-history']);
        },
        error: (error) => {
          console.error(error);
        }
    })
  }
}
