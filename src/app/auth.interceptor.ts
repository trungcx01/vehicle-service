import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class authInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token){
      const modifiedRequest = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
      return next.handle(modifiedRequest);
    }
   return next.handle(req);    
  }
}
