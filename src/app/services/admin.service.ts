import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
    apiUrl = "http://localhost:8080/api/admin"

  constructor(private http: HttpClient) { }

  deleteVehicleCare(id: number, reason: string){
    const params = new HttpParams().set('reason', reason);  
    return this.http.put(`${this.apiUrl}/vehicle-care/${id}`, {}, {params});
  }

  deleteReview(id: number, reason: string){
    const params = new HttpParams().set('reason', reason);  
    return this.http.put(`${this.apiUrl}/review/${id}`, {}, {params});
  }
}
