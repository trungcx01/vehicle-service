import { EmergencyRequestService } from './../../../services/emergency-request.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalComponent } from '../proposal/proposal.component';
import { ShopService } from '../../../services/shop.service';
import { catchError, forkJoin, map, of } from 'rxjs';

@Component({
  selector: 'app-emergency-request-list',
  templateUrl: './emergency-request-list.component.html',
  styleUrl: './emergency-request-list.component.scss'
})
export class EmergencyRequestListComponent implements OnInit{
  constructor(private modalService: NgbModal, private emergencyRequestService: EmergencyRequestService,
    private shopService: ShopService
  ) {}
  emergencyRequests : any[] = [];

  ngOnInit(): void {
      this.emergencyRequestService.getAll().subscribe({
        next: (res) =>{
          console.log(res);
          const checkRequests = res.content.map((element: any) => {
            console.log('dc', element);
            return this.shopService.checkSendProposal(element.id).pipe(
              map((res) =>{
                return ({...element, check: true, proposal: res})
              }),
              catchError(() => of({...element, check: false, proposal: null}))
            );
          });
         
          forkJoin(checkRequests).subscribe({
            next: (res) => {
              console.log('lmm',res);
              this.emergencyRequests = res as any[];
            },
            error: (err) => {
              console.log(err);
            }
          })
        },
        error: (err) => {
          console.log(err);
        }
      })

     
  }

  openProposalModal(request: any) {
    const modalRef = this.modalService.open(ProposalComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.requestId = request.id;
  }

  viewProposalModal(proposal: any) {
    const modalRef = this.modalService.open(ProposalComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.proposal = proposal;
  }
}
