import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-review-manager',
  templateUrl: './review-manager.component.html',
  styleUrl: './review-manager.component.scss'
})
export class ReviewManagerComponent implements OnInit{
  reviews: any;
  constructor(private reviewService: ReviewService){}

  ngOnInit(): void {
      this.reviewService.getAll().subscribe({
        next: (res) => {
          console.log(res);
          this.reviews = res.content;
        },
        error: (error) => {
          console.error(error);
        }
      })
  }
  
}
