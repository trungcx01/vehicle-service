import { ProposalService } from './../../services/proposal.service';
import { EmergencyRequestService } from './../../services/emergency-request.service';
import { PaymentService } from './../../services/payment.service';
import { AppointmentService } from './../../services/appointment.service';
import { AppointmentComponent } from './../appointment/appointment.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  appointment: any;
  proposal: any;
  type: any;
  amount: number = 0;
  shopInfo: any = {};
  customerInfo: any = {};
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private proposalService: ProposalService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.type = params['type'];
      if (params['type'] === 'appointment') {
        const appointmentId = params['id'];
        this.appointmentService.getAppointmentById(appointmentId).subscribe({
          next: (res) => {
            console.log(res);
            this.appointment = res;
            res.vehicleCares.map((v: any) => {
              this.amount += v.price;
            });
            this.shopInfo = res?.vehicleCares?.[0]?.shop;
            this.customerInfo = this.appointment?.customer;
          },
          error: (err) => {
            console.log(err);
          },
        });
      }else{
        const proposalId = params['id'];
        this.proposalService.getById(proposalId).subscribe({
          next: (res: any) => {
            console.log('hdjiej', res);
            this.proposal = res;
            this.amount = 100000;
            this.shopInfo = res?.shop;
            this.customerInfo = res?.emergencyRequest?.customer;
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
    });
  }

  pay(paymentMethod: string) {
    let paymentDTO;
    if (this.type === 'appointment'){
      paymentDTO = {
        proposalId: undefined,
        appointmentId: this.appointment.id,
        amount: this.amount,
        paymentMethod: paymentMethod,
      };
    }else{
      paymentDTO = {
        appointmentId: undefined,
        proposalId: this.proposal.id,
        amount: this.amount,
        paymentMethod: paymentMethod,
      };
    }

    this.paymentService.pay(paymentDTO).subscribe({
      next: (res) => {
        console.log(res);
        if (paymentMethod === 'BANKING') {
          window.location.href = res.payLink;
          // window.open(res.returnUrl, '_blank');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
