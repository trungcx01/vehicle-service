import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppointmentDTO } from '../models/appointment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  apiUrl = "http://localhost:8080/api/appointments"
  constructor(private http: HttpClient) { }

  createAppointment(appointment: IAppointmentDTO): Observable<any>{
    return this.http.post(this.apiUrl, appointment);
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAppointmentByCurrentCustomer(): Observable<any>{
    return this.http.get(this.apiUrl + "/customer");
  }

  getAppointmentById(id: number): Observable<any>{
    return this.http.get(this.apiUrl + "/" + id);
  }

  getByCurrentShop(page?: number, size?: number): Observable<any>{
    return this.http.get(this.apiUrl + "/shop");
  }

  updateStatus(id: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);  
    return this.http.put(this.apiUrl + "/update-status/" + id, {}, { params });
  }
  
  countByDate(date: string): Observable<any>{
    return this.http.get(this.apiUrl + "/count/" + date);
  }

  countByDateAndCurrentShop(date: string): Observable<any>{
    return this.http.get(this.apiUrl + "/count-by-shop/" + date);
  }

  getAll(page?: number, size?: number): Observable<any>{
    return this.http.get(this.apiUrl);
  }

  count(): Observable<any>{
    return this.http.get(this.apiUrl + "/count");
  }

  countByCurrentShop(): Observable<any>{
    return this.http.get(this.apiUrl + "/count-by-shop");
  }

  searchAppointments(page: number, size: number, searchTerm: string): Observable<any> {
    const params = {
      page: page,
      size: size,
      searchTerm: searchTerm,
    };
  
    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  searchAppointmentsInShop(page: number, size: number, searchTerm: string): Observable<any> {
    const params = {
      page: page,
      size: size,
      searchTerm: searchTerm,
    };
  
    return this.http.get(`${this.apiUrl}/search`, { params });
  }
}
