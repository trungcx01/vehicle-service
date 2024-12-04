import { PaymentService } from './../../services/payment.service';
import { AppointmentService } from './../../services/appointment.service';
import { AppointmentComponent } from './../appointment/appointment.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit{
  appointment: any;
  amount: number = 0;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
     private appointmentService: AppointmentService){}

  ngOnInit(): void {
      this.activatedRoute.params.subscribe(params =>{
        const appointmentId = params['id'];
        this.appointmentService.getAppointmentById(appointmentId).subscribe({
          next:(res) =>{
            console.log(res);
            this.appointment = res;

            res.vehicleCares.map((v: any) =>{
              this.amount += v.price;
            })
          },
          error: (err) =>{
            console.log(err);
          }
        })
      })
  }

  pay(paymentMethod: string){
    const paymentDTO = {
      appointmentId: this.appointment.id,
      amount: this.amount,
      paymentMethod: paymentMethod
    }

    this.paymentService.pay(paymentDTO).subscribe({
      next: (res) => {
        console.log(res);
        if (paymentMethod === 'BANKING'){
          window.location.href = res.payLink;
          // window.open(res.returnUrl, '_blank');
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}