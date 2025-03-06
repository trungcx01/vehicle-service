import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { EmergencyRequestService } from '../../../services/emergency-request.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ImageModalComponent } from '../../../image-modal/image-modal.component';
import { Util } from '../../../util';

@Component({
  selector: 'app-emergency-request-management',
  templateUrl: './emergency-request-management.component.html',
  styleUrl: './emergency-request-management.component.scss',
})
export class EmergencyRequestManagementComponent implements OnInit {
  emergencyRequests: any[] = [];
  searchTerm: any
  constructor(
    private emergencyRequestService: EmergencyRequestService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public util: Util,
  ) {}
    currentPage: number = 1;
    itemsPerPage: number = 10; 
    totalRecords: number = 0; 
    private searchSubject: Subject<string> = new Subject<string>();
  

  
    ngOnInit(): void {
      this.getemergencyRequestss();

      this.searchSubject
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((searchTerm) => {
          this.currentPage = 1; 
          if (searchTerm) {
            this.searchemergencyRequestss();
          } else {
            this.getemergencyRequestss();
          }
        });
    }
  
  
    getemergencyRequestss(): void {
      this.emergencyRequestService
        .getAll(this.currentPage - 1, this.itemsPerPage)
        .subscribe({
          next: (response: any) => {
            this.emergencyRequests = response.content.slice().reverse();
            this.totalRecords = response.totalElements;
          },
          error: (error) => {
            console.error('Error fetching emergencyRequestss:', error);
            this.toastr.error('Lỗi khi tải danh sách khách hàng!');
          },
        });
    }
  
  
    searchemergencyRequestss(): void {
      this.emergencyRequestService
        .searchEmergencyRequests(this.currentPage - 1, this.itemsPerPage, this.searchTerm)
        .subscribe({
          next: (response: any) => {
            this.emergencyRequests = response.content.slice().reverse();
            this.totalRecords = response.totalElements;
          },
          error: (error: any) => {
            console.error('Error searching emergencyRequestss:', error);
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
        this.searchTerm ? this.searchemergencyRequestss() : this.getemergencyRequestss();
      }
    }
  
  
    previousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.searchTerm ? this.searchemergencyRequestss() : this.getemergencyRequestss();
      }
    }
  
    get totalPages(): number {
      return Math.ceil(this.totalRecords / this.itemsPerPage);
    }

    openImageModal(imageUrl: any) {
      const modalRef = this.modalService.open(ImageModalComponent, {
        size: 'md',
        centered: true
      });
      modalRef.componentInstance.imageUrl = imageUrl;
    }

}
