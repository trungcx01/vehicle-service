import { IEmergencyRequestDTO } from './../models/emergency-request.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getById(): Observable<any> {
    return this.http.get(this.apiUrl + '/id');
  }
}
