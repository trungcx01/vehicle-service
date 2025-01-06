import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EmergencyRequestService } from './../../services/emergency-request.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReviewComponent } from '../review/review.component';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-emergency-request-customer',
  templateUrl: './emergency-request-customer.component.html',
  styleUrl: './emergency-request-customer.component.scss'
})
export class EmergencyRequestCustomerComponent implements OnInit{
  emergencyRequests: any;
  constructor(private emergencyRequestService: EmergencyRequestService, 
    private toastr: ToastrService,
    private modalService: NgbModal,
    private reviewService: ReviewService
  ){}
  

  async ngOnInit(): Promise<void> {
      this.emergencyRequestService.getByCurrentCustomer().subscribe({
        next: (response: any) => {
          Promise.all(
            response.map(async (res: any) => {
              const proposalId = res.proposals.filter((p: any) =>{
                return p.status === 'ACCEPTED'
              })[0].id;
              const review = await this.getReviewOfProposal(proposalId);
              console.log(res);
              return {
                ...res,
                review: review
              };    
            })
          ).then((emergencyRequestList) => {
            this.emergencyRequests = emergencyRequestList;
            console.log('pkp', this.emergencyRequests);
          }).catch((error) => {
            console.error("Error while fetching appointments: ", error);
          });
        },
        error: (error) => {
          console.error("Error fetching appointments: ", error);
        }
      });
  }
  
  updateStatus(requestId: number, status: string){
    this.emergencyRequestService.updateStatus(status, requestId).subscribe({
      next: (response) => {
        this.toastr.success('Status updated successfully');
        window.location.reload();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })
  }

  openReviewForm(emergencyRequest: any){
    const proposal = emergencyRequest.proposals.filter((p: any) =>{
      return p.status === 'ACCEPTED'
    })[0];
    console.log(proposal);
    const modalRef = this.modalService.open(ReviewComponent, {
      size: 'md',
      centered: true
    })
    modalRef.componentInstance.proposalId = proposal.id;
    modalRef.componentInstance.customerId = emergencyRequest.customer.id;
  }

  openReviewDetail(review: any){
    const modalRef = this.modalService.open(ReviewComponent, {
      size: 'md',
      centered: true
    })
    modalRef.componentInstance.proposalReview = review;
  }

  async getReviewOfProposal(id: number): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.reviewService.getByProposal(id).subscribe({
        next: (response) => {
          console.log(response);
          resolve(response);
        },
        error: (error) => {
          console.error(error);
          reject(error);
        }
      })
    })
  }
  

}
