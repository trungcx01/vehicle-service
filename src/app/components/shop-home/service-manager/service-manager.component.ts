import { VehicleCareService } from './../../../services/vehicle-care.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceUpdateComponent } from '../service-update/service-update.component';
import Swal from 'sweetalert2';
import { ImageModalComponent } from '../../../image-modal/image-modal.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-service-manager',
  templateUrl: './service-manager.component.html',
  styleUrl: './service-manager.component.scss',
})
export class ServiceManagerComponent implements OnInit {
  vehicleCares: any;  
    searchTerm: string = '';
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalRecords: number = 0;
    private searchSubject: Subject<string> = new Subject<string>();
  
    ngOnInit(): void {
      this.getVehicleCares();
  
      this.searchSubject
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((searchTerm) => {
          this.currentPage = 1;
          if (searchTerm) {
            this.searchVehicleCares();
          } else {
            this.getVehicleCares();
          }
        });
    }
  
    getVehicleCares(): void {
      this.vehicleCareService
        .getByCurrentShop(this.currentPage - 1, this.itemsPerPage)
        .subscribe({
          next: (response: any) => {
            console.log("udio", response)
            this.vehicleCares = response.content;
            this.totalRecords = response.totalElements;
          },
          error: (error) => {
            console.error('Error fetching VehicleCares:', error);
            this.toastr.error('Lỗi khi tải danh sách khách hàng!');
          },
        });
    }
  
    searchVehicleCares(): void {
      this.vehicleCareService
        .searchInCurrentShop(
          this.currentPage - 1,
          this.itemsPerPage,
          this.searchTerm
        )
        .subscribe({
          next: (response: any) => {
            this.vehicleCares = response.content;
            this.totalRecords = response.totalElements;
          },
          error: (error: any) => {
            console.error('Error searching VehicleCares:', error);
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
        this.searchTerm ? this.searchVehicleCares() : this.getVehicleCares();
      }
    }
  
    previousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.searchTerm ? this.searchVehicleCares() : this.getVehicleCares();
      }
    }
  
    get totalPages(): number {
      return Math.ceil(this.totalRecords / this.itemsPerPage);
    }
  

  constructor(
    private toastr: ToastrService,
    private vehicleCareService: VehicleCareService,
    private modalService: NgbModal
  ) {}


  openNew() {
    const modalRef = this.modalService.open(ServiceUpdateComponent, {
      size: 'lg',
      centered: true,
    });

    // modalRef.componentInstance.vehicareId =
  }

  openUpdate(vehicleCare: any){
    const modalRef = this.modalService.open(ServiceUpdateComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.vehicleCare = vehicleCare;
  }
  delete(vehicleCareId: number) {
    Swal.fire({
      title: 'Warning',
      text: 'Bạn có chắc chắn muốn xóa Dịch vụ này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa dịch vụ',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.vehicleCareService.delete(vehicleCareId).subscribe({
          next: () => {
           
            window.location.reload();
            this.toastr.success('Xóa thành công');
          },
          error: (error) => console.error(error),
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
