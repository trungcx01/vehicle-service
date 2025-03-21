import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   private apiUrl = "http://localhost:8080/api/users"

  constructor(private http: HttpClient) { }

  updateAvatar(avatar: any){
    const formData = new FormData();
    formData.append('avatar', avatar);
    return this.http.put(`${this.apiUrl}/update-avatar`, formData)
  }

  getByDate(date: string){
    return this.http.get(`${this.apiUrl}/get-by-date/${date}`)
  }

  lockAccount(userId: number): Observable<any>{
    return this.http.put(this.apiUrl + "/lock/" + userId, {});
  }

  unlockAccount(userId: number): Observable<any>{
    return this.http.put(this.apiUrl + "/unlock/" + userId, {});
  }

  count(): Observable<any>{
    return this.http.get(this.apiUrl + "/count");
  }
}
