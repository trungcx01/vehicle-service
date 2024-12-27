import { PaymentService } from './../../services/payment.service';
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
  amount = 1500000; // Số tiền giao dịch
  transactionId = 'TXN987654321'; // Mã giao dịch
  transactionDate = new Date();
  
  // Tên dịch vụ
  serviceName = 'Bảo dưỡng định kỳ';

  // Thông tin cửa hàng
  shopName = 'Cửa hàng Xe Minh';
  shopAddress = 'Số 10, đường ABC, Quận 1, TP.HCM';
  shopPhone = '0901234567';

  // Thông tin ngân hàng
  senderBank = 'Ngân hàng Techcombank';
  senderAccount = '1234567890123';
  receiverBank = 'Ngân hàng Vietcombank';
  receiverAccount = '9876543210987';

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
    window.location.href = '/'; // Quay lại trang chính
  }

  navToMap(){
    this.router.navigate(['/map-emergency/' + this.payment.baseService.id ]);
  }
}
