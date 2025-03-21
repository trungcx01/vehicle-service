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
    return this.http.get(this.apiUrl + "/shop/" + id);
  }

  getByShopAndAvailable(id: number): Observable<any>{
    return this.http.get(this.apiUrl + "/shop/" + id + "/available");
  }

  getByCurrentShop(page?: number, size?: number): Observable<any>{
    return this.http.get(this.apiUrl + "/current-shop");
  }

  create(vehicleCare: IVehicleCareDTO, image: File): Observable<any>{
    const formData = new FormData();
    formData.append(
      'vehicleCareDTO',
      new Blob([JSON.stringify(vehicleCare)], {
        type: 'application/json',
      })
    );
    formData.append('image', image);
    return this.http.post(this.apiUrl, formData);
  }

  update(vehicleCare: IVehicleCareDTO, image: File): Observable<any>{
    const formData = new FormData();
    formData.append(
      'vehicleCareDTO',
      new Blob([JSON.stringify(vehicleCare)], {
        type: 'application/json',
      })
    );
    formData.append('image', image);
    return this.http.put(this.apiUrl, formData);
  }

  delete(vehicleCareId: number){
    return this.http.delete(this.apiUrl + "/" + vehicleCareId);
  }

  search(name: string, district: string, start: any, end: any): Observable<any>{
    return this.http.get(`${this.apiUrl}/search?name=${name}&district=${district}&priceFrom=${start}&priceTo=${end}`);
  }
  getAll(page?: number, size?: number): Observable<any>{
    return this.http.get(this.apiUrl);
  }

  searchVehicleCares(page: number, size: number, searchTerm: string): Observable<any> {
    const params = {
      page: page,
      size: size,
      searchTerm: searchTerm,
    };
  
    return this.http.get(`${this.apiUrl}/search-all`, { params });
  }

  searchInCurrentShop(page: number, size: number, searchTerm: string): Observable<any> {
    const params = {
      page: page,
      size: size,
      searchTerm: searchTerm,
    };
  
    return this.http.get(`${this.apiUrl}/search-all`, { params });
  }
}
