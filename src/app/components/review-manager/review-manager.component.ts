import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-review-manager',
  templateUrl: './review-manager.component.html',
  styleUrl: './review-manager.component.scss'
})
export class ReviewManagerComponent implements OnInit{
  reviews: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10; 
  totalRecords: number = 0; 
  private searchSubject: Subject<string> = new Subject<string>();


  ngOnInit(): void {
    this.getReviews();


    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.currentPage = 1; 
        if (searchTerm) {
          this.searchReviews();
        } else {
          this.getReviews();
        }
      });
  }


  getReviews(): void {
    this.reviewService
      .getByCurrentShop(this.currentPage - 1, this.itemsPerPage)
      .subscribe({
        next: (response: any) => {
          this.reviews = response.content;
          this.totalRecords = response.totalElements;
        },
        error: (error) => {
          console.error('Error fetching reviews:', error);
          this.toastr.error('Lỗi khi tải danh sách khách hàng!');
        },
      });
  }


  searchReviews(): void {
    this.reviewService
      .searchReviewsInShop(this.currentPage - 1, this.itemsPerPage, this.searchTerm)
      .subscribe({
        next: (response: any) => {
          this.reviews = response.content;
          this.totalRecords = response.totalElements;
        },
        error: (error: any) => {
          console.error('Error searching reviews:', error);
          this.toastr.error('Lỗi khi tìm kiếm khách hàng!');
        },
      });
  }


  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }


  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.searchTerm ? this.searchReviews() : this.getReviews();
    }
  }


  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchTerm ? this.searchReviews() : this.getReviews();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.itemsPerPage);
  }
  
  constructor(private reviewService: ReviewService, private toastr: ToastrService){}
  
}
