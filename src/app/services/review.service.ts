import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReviewDTO } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = "http://localhost:8080/api/reviews"
  constructor(private http: HttpClient) { }

  top8NewestReviews(): Observable<any>{
    return this.http.get(this.apiUrl + "/top8-newest");
  }

  addReview(review: IReviewDTO, image: File): Observable<any>{
    const formData = new FormData();
    formData.append('reviewDTO',  new Blob([JSON.stringify(review)], {
      type: 'application/json',
    }));
    formData.append('image', image);
    return this.http.post(this.apiUrl, formData);
  }

  getAll(): Observable<any>{
    return this.http.get(this.apiUrl);
  }

  getByAppointment(id: number): Observable<any>{
    return this.http.get(this.apiUrl + "/get-by-appointment/" + id);
  }
  getByProposal(id: number): Observable<any>{
    return this.http.get(this.apiUrl + "/get-by-proposal/" + id);
  }

  getByShop(id: number): Observable<any>{
    return this.http.get(this.apiUrl + "/get-by-shop/" + id);
  }

  delete(id: number): Observable<any>{
    return this.http.delete(this.apiUrl + "/" + id);
  }
}
