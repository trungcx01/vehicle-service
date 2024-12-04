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

  getAppointmentByCurrentCustomer(): Observable<any>{
    return this.http.get(this.apiUrl + "/customer");
  }

  getAppointmentById(id: number): Observable<any>{
    return this.http.get(this.apiUrl + "/" + id);
  }

  getByCurrentShop(): Observable<any>{
    return this.http.get(this.apiUrl + "/shop");
  }

  updateStatus(id: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);  
    return this.http.put(this.apiUrl + "/update-status/" + id, {}, { params });
  }
  
}
