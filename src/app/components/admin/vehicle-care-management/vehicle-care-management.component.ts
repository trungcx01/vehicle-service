import { Component, OnInit } from '@angular/core';
import { VehicleCareService } from '../../../services/vehicle-care.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AdminService } from '../../../services/admin.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageModalComponent } from '../../../image-modal/image-modal.component';

@Component({
  selector: 'app-vehicle-care-management',
  templateUrl: './vehicle-care-management.component.html',
  styleUrl: './vehicle-care-management.component.scss',
})
export class VehicleCareManagementComponent implements OnInit {
  vehicleCares: any[] = [];

  constructor(
    private adminService: AdminService,
    private vehicleCareService: VehicleCareService,
    private toastr: ToastrService,
     private modalService: NgbModal
  ) {}

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
      .getAll(this.currentPage - 1, this.itemsPerPage)
      .subscribe({
        next: (response: any) => {
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
      .searchVehicleCares(
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

  delete(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn sẽ không thể khôi phục vehicle care này.',
      icon: 'warning',
      input: 'textarea', // Thêm trường input dạng textarea để nhập lý do
      inputPlaceholder: 'Nhập lý do tại đây...',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      inputValidator: (value) => {
        if (!value) {
          return 'Bạn cần nhập lý do trước khi xóa!';
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value;
        this.adminService.deleteVehicleCare(id, reason).subscribe({
          next: (response) => {
            this.toastr.success('Đã xóa vehicle care!');
            this.vehicleCares = this.vehicleCares.filter(
              (vehicleCare) => vehicleCare.id !== id
            );
          },
          error: (error) => {
            console.error('Error:', error);
            Swal.fire('Lỗi', 'Đã xảy ra lỗi khi xóa vehicle care.', 'error');
          },
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
