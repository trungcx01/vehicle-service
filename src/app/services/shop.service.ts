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

  createShop(shop: IShopDTO): Observable<any>{
    return this.http.post(this.apiUrl, shop);
  }

  getById(id: number): Observable<any>{
    return this.http.get(this.apiUrl + "/" + id);
  }

  getCurrent(): Observable<any>{
    return this.http.get(this.apiUrl + "/current");
  }
  update(shop: IShopDTO): Observable<any>{
    return this.http.put(this.apiUrl, shop)
  }

  checkSendProposal(erId: number): Observable<any>{
    return this.http.get(this.apiUrl + "/check-send-proposal/" + erId);
  }

  searchShop(name: string, district: string): Observable<any>{
    return this.http.get(`${this.apiUrl}/search?name=${name}&district=${district}`);
  }

  getAll(): Observable<any>{
    return this.http.get(this.apiUrl);
  }

  delete(id: number): Observable<any>{
    return this.http.delete(this.apiUrl + "/" + id);
  }
}
