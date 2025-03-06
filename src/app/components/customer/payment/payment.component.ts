import { ProposalService } from '../../../services/proposal.service';
import { EmergencyRequestService } from '../../../services/emergency-request.service';
import { PaymentService } from '../../../services/payment.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AppointmentComponent } from '../appointment/appointment.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

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
    private appointmentService: AppointmentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.type = params['type'];
      const id = params['id'];
  
      if (this.type === 'appointment') {
        this.handleAppointment(id);
      } else {
        this.handleProposal(id);
      }
    });
  }
  
  handleAppointment(appointmentId: number): void {
    this.appointmentService.getAppointmentById(appointmentId).subscribe({
      next: (res) => {
        console.log(res);
        this.appointment = res;
        this.amount = res.vehicleCares.reduce((total: number, v: any) => total + v.price, 0);
        this.shopInfo = res?.vehicleCares?.[0]?.shop;
        this.customerInfo = this.appointment?.customer;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  
  handleProposal(proposalId: number): void {
    this.proposalService.getById(proposalId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.proposal = res;
        this.amount = 100000;
        this.shopInfo = res?.shop;
        this.customerInfo = res?.emergencyRequest?.customer;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  

  pay(paymentMethod: string) {
    let paymentDTO;
    if (this.type === 'appointment') {
      paymentDTO = {
        proposalId: undefined,
        appointmentId: this.appointment.id,
        amount: this.amount,
        paymentMethod: paymentMethod,
      };
    } else {
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
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Thanh toán thành công!',
            text: 'Cảm ơn bạn đã thanh toán. Chúng tôi đang xử lý đơn hàng của bạn.',
            confirmButtonText: 'OK',
          }).then(() => {
            this.router.navigate([`/payment-success/${res.id}`]);
          });
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message)
      },
    });
  }
}
