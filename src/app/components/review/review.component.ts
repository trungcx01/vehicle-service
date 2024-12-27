import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit{
  previewImage: any
  image: any;
  rate: number = 0;
  description: any;
  @Input() appointmentId: any;
  @Input() customerId: any;
  @Input() proposalId: any;
  @Input() proposalReview: any;
  @Input() appointmentReview: any;

  constructor(private reviewService: ReviewService, private toastr: ToastrService,   public activeModal: NgbActiveModal,){}
  ngOnInit(): void {
    if (this.appointmentReview){
      
      this.rate = this.appointmentReview.rate;
      this.description = this.appointmentReview.description;
      this.previewImage = this.appointmentReview.imageUrl;
    }else if (this.proposalReview){
      this.rate = this.proposalReview.rate;
      this.description = this.proposalReview.description;
      this.previewImage = this.proposalReview.imageUrl;
    }
  }

  closeModal(){
    this.activeModal.close();
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.image = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImage = (e.target.result);
        };
        reader.readAsDataURL(file); // sau khi đọc file xong thì sẽ lưu dạng base64 về e.target.result ở dòng 51
  }

  setRating(value: number): void {
    this.rate= value;
  }

  submitReview(){
    if (this.description.length < 20){
      this.toastr.error("Đánh giá phải đủ 20 kí tự trở lên!");
      return;
    }
   
    const review = {
      customerId: this.customerId,
      rate: this.rate,
      description: this.description,
      proposalId: this.proposalId ? this.proposalId : null,
      appointmentId: this.appointmentId ? this.appointmentId : null,
    }
    console.log('gfhd', review)
    this.reviewService.addReview(review, this.image).subscribe({
      next: (res) =>{
        console.log(res);
        this.toastr.success("Bình luận thành công!")
        this.activeModal.close();
        window.location.reload();
      }, 
      error: (error) =>{
        this.toastr.error(error.error.message)
        console.log(error);
      }
    })
  }
}
