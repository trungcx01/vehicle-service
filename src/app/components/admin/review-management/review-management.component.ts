import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../services/review.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-review-management',
  templateUrl: './review-management.component.html',
  styleUrl: './review-management.component.scss',
})
export class ReviewManagementComponent implements OnInit {
  reviews: any[] = [];
  constructor(
    private reviewService: ReviewService,
    private toastr: ToastrService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.reviewService.getAll().subscribe({
      next: (response) => {
        this.reviews = response.content;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

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
  
}
