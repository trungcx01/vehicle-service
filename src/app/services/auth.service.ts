import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserDTO } from '../models/user.model';
import { Observable } from 'rxjs';
import { ILoginDTO, LoginDTO } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "http://localhost:8080/api"

  constructor(private http: HttpClient) { }

  signUp(userDTO: IUserDTO): Observable<any>{
    return this.http.post<any>(this.apiUrl + "/auth/signup", userDTO);
  }

  login(login: ILoginDTO): Observable<any>{
    return this.http.post(this.apiUrl + "/auth/login", login)
  }
  activated(key: string): Observable<any> {
    const params = new HttpParams().set('key', key);
    return this.http.post(this.apiUrl + "/auth/activated", {}, { params }); // Correct usage of params
  }

changePassword(oldPassword: string, newPassword: string){
  const params = new HttpParams()
  .set('oldPassword', oldPassword)
  .set('newPassword', newPassword);

    return this.http.post(this.apiUrl + "/change-password",{}, {params})
  }
  
  getCurrentUser(): Observable<any>{
    return this.http.get(this.apiUrl + "/get-user")
  }

  requestResetPass(email: string): Observable<any>{
    const params = new HttpParams()
    .set('email', email);
    return this.http.post(this.apiUrl + "/request-reset-password", {}, {params});
  }

  resetPassword(forgotPasswordDTO: any): Observable<any>{
    return this.http.post(this.apiUrl + "/reset-password", forgotPasswordDTO);
  }
}