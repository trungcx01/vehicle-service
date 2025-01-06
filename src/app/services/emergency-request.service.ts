import { IEmergencyRequestDTO } from './../models/emergency-request.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmergencyRequestService {
  private apiUrl = 'http://localhost:8080/api/emergency-requests';

  constructor(private http: HttpClient) {}

  createEmergencyRequest(
    image1: File,
    image2: File,
    image3: File,
    request: IEmergencyRequestDTO
  ): Observable<any> {
    // const headers= new HttpHeaders({ 'content-type': 'multipart/form-data' })
    const formData = new FormData();
    if (image1 !== null) {
      formData.append('image1', image1, image1.name);
    }
    if (image2 !== null) {
      formData.append('image2', image2, image2.name);
    }
    if (image3 !== null) {
      formData.append('image3', image3, image3.name);
    }

    formData.append(
      'emergencyRequestDTO',
      new Blob([JSON.stringify(request)], {
        type: 'application/json',
      })
    );
    return this.http.post(this.apiUrl, formData);
  }

  getAll(page?: number, size?: number): Observable<any>{
    return this.http.get(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get(this.apiUrl + '/' + id);
  }
  updateStatus(status: string, id: number): Observable<any> {
    const params = new HttpParams().set('status', status);  
    return this.http.put(this.apiUrl + "/update-status/" + id, {}, { params });
  }

  countByDate(date: string): Observable<any>{
    return this.http.get(this.apiUrl + "/count/" + date);
  }

  countByDateAndCurrentShop(date: string): Observable<any>{
    return this.http.get(this.apiUrl + "/count-by-shop/" + date);
  }

  getByCurrentCustomer(){
    return this.http.get(this.apiUrl + "/current-customer");
  }

  count(): Observable<any>{
    return this.http.get(this.apiUrl + "/count");
  }

  countByCurrentShop(): Observable<any>{
    return this.http.get(this.apiUrl + "/count-by-shop");
  }

  searchEmergencyRequests(page: number, size: number, searchTerm: string): Observable<any> {
    const params = {
      page: page,
      size: size,
      searchTerm: searchTerm,
    };
  
    return this.http.get(`${this.apiUrl}/search`, { params });
  }
}
