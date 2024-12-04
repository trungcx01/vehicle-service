import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
}
