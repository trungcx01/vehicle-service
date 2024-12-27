import { Component, OnInit } from '@angular/core';
import { VehicleCareService } from '../../../services/vehicle-care.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-vehicle-care-management',
  templateUrl: './vehicle-care-management.component.html',
  styleUrl: './vehicle-care-management.component.scss'
})
export class VehicleCareManagementComponent implements OnInit{
  vehicleCares: any[] = [];

  constructor(private adminService: AdminService, private vehicleCareService: VehicleCareService, private toastr: ToastrService){}

  ngOnInit(): void {
      this.vehicleCareService.getAll().subscribe({
        next: (response) => {
          this.vehicleCares = response.content;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      })
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
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value; 
        this.adminService.deleteVehicleCare(id, reason).subscribe({
          next: (response) => {
            this.toastr.success('Đã xóa vehicle care!');
            this.vehicleCares = this.vehicleCares.filter(vehicleCare => vehicleCare.id !== id);
          },
          error: (error) => {
            console.error('Error:', error);
            Swal.fire('Lỗi', 'Đã xảy ra lỗi khi xóa vehicle care.', 'error');
          }
        });
      }
    });
  }
  
}
