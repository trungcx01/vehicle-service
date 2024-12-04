import { VehicleCareService } from './../../../services/vehicle-care.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceUpdateComponent } from '../service-update/service-update.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-manager',
  templateUrl: './service-manager.component.html',
  styleUrl: './service-manager.component.scss',
})
export class ServiceManagerComponent implements OnInit {
  vehicleCares: any;
  constructor(
    private toastr: ToastrService,
    private vehicleCareService: VehicleCareService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.vehicleCareService.getByCurrentShop().subscribe({
      next: (data) => (this.vehicleCares = data),
      error: (error) => console.error(error),
    });
  }

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
}
