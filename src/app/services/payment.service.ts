import { IPaymentDTO } from './../models/payment.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  apiUrl = 'http://localhost:8080/api/payments'

  constructor(private http: HttpClient) { }

  pay(paymentDTO: IPaymentDTO): Observable<any>{
    return this.http.post(this.apiUrl, paymentDTO);
  }
  getPayment(id: number): Observable<any>{
    return this.http.get(this.apiUrl + "/" + id);
  }
}
