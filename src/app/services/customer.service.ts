import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomerDTO } from '../models/customer.model';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = "http://localhost:8080/api/customers"

  constructor(private http: HttpClient) { }

  createCustomer(customer: ICustomerDTO): Observable<any>{
    return this.http.post(this.apiUrl, customer);
  }

  getCurrentCustomer(): Observable<any>{
    return this.http.get(this.apiUrl + "/current");
  }
  update(customer: ICustomerDTO): Observable<any>{
    return this.http.put(this.apiUrl, customer)
  }

  getByPhone(phoneNumber: string){
    const params = new HttpParams().set('phoneNumber', phoneNumber);
    return this.http.get(this.apiUrl + "/get-by-phone", {params: params})
  }

  getAll(page?: number, size?: number): Observable<any>{
    return this.http.get(this.apiUrl);
  }

  delete(id: number): Observable<any>{
    return this.http.delete(this.apiUrl + "/" + id);
  }

  searchCustomers(page: number, size: number, searchTerm: string): Observable<any> {
    const params = {
      page: page,
      size: size,
      searchTerm: searchTerm,
    };
  
    return this.http.get(`${this.apiUrl}/search`, { params });
  }
  
 

  // updateInfo(avatar: File, customer: ICustomerDTO): Observable<any>{
  //   const formData = new FormData();
  //   formData.append('avatar', avatar);
  //   formData.append('customer', customer);
  //   return this.http.put(this.apiUrl + "/update-info", formData);
  // }
}
