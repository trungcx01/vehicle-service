import { EmergencyRequestService } from './../../../services/emergency-request.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalComponent } from '../proposal/proposal.component';
import { ShopService } from '../../../services/shop.service';
import { catchError, debounceTime, distinctUntilChanged, forkJoin, from, map, mergeMap, of, Subject, tap, toArray } from 'rxjs';
import Swal from 'sweetalert2';
import { ImageModalComponent } from '../../../image-modal/image-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-emergency-request-list',
  templateUrl: './emergency-request-list.component.html',
  styleUrl: './emergency-request-list.component.scss'
})
export class EmergencyRequestListComponent implements OnInit{

  emergencyRequests: any[] = [];
  searchTerm: any
    currentPage: number = 1;
    itemsPerPage: number = 10; 
    totalRecords: number = 0; 
    private searchSubject: Subject<string> = new Subject<string>();
  

  
    ngOnInit(): void {
      this.getEmergencyRequests();
      this.searchSubject
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((searchTerm) => {
          this.currentPage = 1; 
          if (searchTerm) {
            this.searchEmergencyRequests();
          } else {
            this.getEmergencyRequests();
          }
        });
    }
  
  
    getEmergencyRequests(): void {
      const page = this.currentPage - 1; 
      const size = this.itemsPerPage;   
      this.emergencyRequestService.getAll(page, size).subscribe({
        next: (res) =>{
          console.log('kdie', res);
          this.totalRecords = res.totalElements;
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
            next: (res: any) => {
              console.log('lmm',res);
              this.emergencyRequests = res.reverse();
            
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
  


searchEmergencyRequests(): void {
  const page = this.currentPage - 1; 
  const size = this.itemsPerPage;   

  this.emergencyRequestService
    .searchEmergencyRequests(page, size, this.searchTerm)
    .subscribe({
      next: (res: any) => {
        console.log('Emergency Requests Response:', res);
        this.totalRecords = res.totalElements;

        from(res.content).pipe(
          mergeMap((element: any) =>
            this.shopService.checkSendProposal(element.id).pipe(
              map((proposalRes) => ({
                ...element,
                check: true,
                proposal: proposalRes,
              })),
              catchError((error) => {
                console.error(`Error checking proposal for ID ${element.id}:`, error);
                return of({ ...element, check: false, proposal: null });
              })
            )
          ),
          tap((processedElement) => {
            console.log('Processed Emergency Request:', processedElement);
            this.emergencyRequests = [...this.emergencyRequests, processedElement];
          }),
          toArray() 
        ).subscribe({
          next: (finalRes: any) => {
            console.log('Processed All Emergency Requests:', finalRes);
            this.emergencyRequests = finalRes; 
          },
          error: (err) => {
            console.error('Error while processing proposals:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error searching emergency requests:', err);
        this.toastr.error('Lỗi khi tìm kiếm yêu cầu khẩn cấp!');
      }
    });
}

    
    
  
  
    onSearchChange(): void {
      this.searchSubject.next(this.searchTerm);
    }
  
  
    nextPage(): void {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.searchTerm ? this.searchEmergencyRequests() : this.getEmergencyRequests();
      }
    }
  
  
    previousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.searchTerm ? this.searchEmergencyRequests() : this.getEmergencyRequests();
      }
    }
  
    get totalPages(): number {
      return Math.ceil(this.totalRecords / this.itemsPerPage);
    }
  constructor(private modalService: NgbModal, private emergencyRequestService: EmergencyRequestService,
    private shopService: ShopService, private toastr: ToastrService
  ) {}

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

  updateStatus(requestId: number, status: string){
    
  }

  openImageModal(imageUrl: any) {
    const modalRef = this.modalService.open(ImageModalComponent, {
      size: 'md',
      centered: true
    });
    modalRef.componentInstance.imageUrl = imageUrl;
  }

  translateVehicleType(type: string): string {
    switch (type) {
      case 'XE_SO':
        return 'Xe số';
      case 'XE_TAY_GA':
        return 'Xe tay ga';
      case 'XE_CON_TAY':
        return 'Xe côn tay';
      case 'XE_PHAN_KHOI_LON':
        return 'Xe phân khối lớn';
      case 'XE_DIEN':
        return 'Xe điện';
      default:
        return 'Không xác định';
    }
  }
  
}
