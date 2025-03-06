import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../services/review.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AdminService } from '../../../services/admin.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Util } from '../../../util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageModalComponent } from '../../../image-modal/image-modal.component';

@Component({
  selector: 'app-review-management',
  templateUrl: './review-management.component.html',
  styleUrl: './review-management.component.scss',
})
export class ReviewManagementComponent implements OnInit {
  reviews: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10; 
  totalRecords: number = 0; 
  private searchSubject: Subject<string> = new Subject<string>();


  ngOnInit(): void {
    this.getreviews();


    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.currentPage = 1; 
        if (searchTerm) {
          this.searchreviews();
        } else {
          this.getreviews();
        }
      });
  }


  getreviews(): void {
    this.reviewService
      .getAll(this.currentPage - 1, this.itemsPerPage)
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


  searchreviews(): void {
    this.reviewService
      .searchReviews(this.currentPage - 1, this.itemsPerPage, this.searchTerm)
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
      this.searchTerm ? this.searchreviews() : this.getreviews();
    }
  }


  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchTerm ? this.searchreviews() : this.getreviews();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.itemsPerPage);
  }
  
  constructor(
    private reviewService: ReviewService,
    private toastr: ToastrService,
    private adminService: AdminService,
    public util: Util,
    private modalService: NgbModal,
  ) {}



  delete(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn không?',
      text: 'Hành động này sẽ xóa vĩnh viễn đánh giá và không thể khôi phục.',
      icon: 'warning',
      input: 'textarea', 
      inputPlaceholder: 'Nhập lý do xóa...',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận xóa',
      cancelButtonText: 'Hủy bỏ',
      inputValidator: (value) => {
        if (!value) {
          return 'Bạn cần nhập lý do trước khi xóa!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value; 
        this.adminService.deleteReview(id, reason).subscribe({
          next: (response) => {
            this.toastr.success('Đã xóa đánh giá thành công!', 'Thành công');
            this.reviews = this.reviews.filter((r) => r.id != id);
          },
          error: (error) => {
            console.error('Lỗi:', error);
            Swal.fire('Lỗi', 'Có lỗi xảy ra khi xóa đánh giá.', 'error');
          }
        });
      }
    });
  }
  
  openImageModal(imageUrl: any) {
    const modalRef = this.modalService.open(ImageModalComponent, {
      size: 'md',
      centered: true
    });
    modalRef.componentInstance.imageUrl = imageUrl;
  }
}
