import { Route, Router } from '@angular/router';
import { OthersService } from '../../services/others.service';
import { ReviewService } from './../../services/review.service';
import { ShopService } from './../../services/shop.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  top6ShopRating: any;
  top8ReviewNewest: any;
  constructor(
    private shopService: ShopService,
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shopService.getTop6Rating().subscribe({
      next: (data) => {
        this.top6ShopRating = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });

    this.reviewService.top8NewestReviews().subscribe({
      next: (data) => {
        console.log(data);
        this.top8ReviewNewest = data;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });

    this.getCurrentLocation();
  }


  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currLat = position.coords.latitude;
        const currLng = position.coords.longitude;
      });
    }
  }

  navToShopDetail(id: number){
    this.router.navigate(['/shop-detail', id]);
  }


  
}
