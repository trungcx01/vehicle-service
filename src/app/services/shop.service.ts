import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IShopDTO } from '../models/shop.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = "http://localhost:8080/api/shops"

  constructor(private http: HttpClient) { }

  getTop6Rating(): Observable<any>{
    return this.http.get(this.apiUrl + "/top6-rating");
  }

  createShop(shop: IShopDTO, cover: any): Observable<any>{
    const formData = new FormData();
    formData.append('cover', cover);
    formData.append(
      'shopDTO',
      new Blob([JSON.stringify(shop)], {
        type: 'application/json',
      })
    );
    return this.http.post(this.apiUrl, formData);
  }

  getById(id: number): Observable<any>{
    return this.http.get(this.apiUrl + "/" + id);
  }

  getCurrent(): Observable<any>{
    return this.http.get(this.apiUrl + "/current");
  }
  update(shop: IShopDTO, cover: any): Observable<any>{
    const formData = new FormData();
    formData.append('cover', cover);
    formData.append(
      'shopDTO',
      new Blob([JSON.stringify(shop)], {
        type: 'application/json',
      })
    );
    return this.http.put(this.apiUrl, formData)
  }

  checkSendProposal(erId: number): Observable<any>{
    return this.http.get(this.apiUrl + "/check-send-proposal/" + erId);
  }

  searchShop(name: string, district: string, rating: any): Observable<any>{
    return this.http.get(`${this.apiUrl}/search?name=${name}&district=${district}&rating=${rating}`);
  }

  getAll(page?: number, size?: number): Observable<any>{
    return this.http.get(this.apiUrl);
  }

  delete(id: number): Observable<any>{
    return this.http.delete(this.apiUrl + "/" + id);
  }

  getTop10Revenue(): Observable<any>{
    return this.http.get(this.apiUrl + "/top-10-revenue");
  }

  searchShops(page: number, size: number, searchTerm: string): Observable<any> {
    const params = {
      page: page,
      size: size,
      searchTerm: searchTerm,
    };
  
    return this.http.get(`${this.apiUrl}/search-all`, { params });
  }
}
