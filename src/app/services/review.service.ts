import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = "http://localhost:8080/api/reviews"
  constructor(private http: HttpClient) { }

  top8NewestReviews(): Observable<any>{
    return this.http.get(this.apiUrl + "/top8-newest");
  }
}
