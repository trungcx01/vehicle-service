import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVehicleCareDTO } from '../models/vehicle-care.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleCareService {
  apiUrl = 'http://localhost:8080/api/vehicle-cares'
  constructor(private http: HttpClient) { }

  getByShop(id: number): Observable<any>{
    return this.http.get(this.apiUrl + "/shop-" + id);
  }

  getByCurrentShop(): Observable<any>{
    return this.http.get(this.apiUrl + "/current-shop");
  }

  create(vehicleCare: IVehicleCareDTO): Observable<any>{
    return this.http.post(this.apiUrl, vehicleCare);
  }

  update(vehicleCare: IVehicleCareDTO): Observable<any>{
    return this.http.put(this.apiUrl, vehicleCare);
  }

  delete(vehicleCareId: number){
    return this.http.delete(this.apiUrl + "/" + vehicleCareId);
  }

  search(name: string, start: any, end: any): Observable<any>{
    return this.http.get(`${this.apiUrl}/search?name=${name}&start=${start}&end=${end}`);
  }
}
