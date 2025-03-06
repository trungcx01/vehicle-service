import { PaymentService } from '../../../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit{
  payment: any;

  constructor(private activatedRoute: ActivatedRoute, private paymentService: PaymentService, 
    private router: Router
  ){}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      console.log(id);
      this.paymentService.getPayment(id).subscribe({
        next: (data) => {
          console.log(data);
          this.payment = data;
        },
        error: (error) => {
          console.error(error);
        },
      });
    });
  }
  

  retryPayment(){
    this.router.navigate(['/payment'], this.payment.id);
  }
  printBill() {
    window.print(); 
  }

  goToHome() {
    window.location.href = '/'; 
  }

  navToMap(){
    this.router.navigate(['/map-emergency/' + this.payment.baseService.id ]);
  }
}
