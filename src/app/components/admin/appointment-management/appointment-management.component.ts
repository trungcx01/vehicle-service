import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Util } from '../../../util';

@Component({
  selector: 'app-appointment-management',
  templateUrl: './appointment-management.component.html',
  styleUrl: './appointment-management.component.scss',
})
export class AppointmentManagementComponent implements OnInit {
  appointments: any[] = [];
  searchTerm: string = '';

  currentPage: number = 1;
    itemsPerPage: number = 10; 
    totalRecords: number = 0; 
    private searchSubject: Subject<string> = new Subject<string>();
  
    ngOnInit(): void {
      this.getCustomers();
  
  
      this.searchSubject
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((searchTerm) => {
          this.currentPage = 1; 
          if (searchTerm) {
            this.searchCustomers();
          } else {
            this.getCustomers();
          }
        });
    }
  
  
    getCustomers(): void {
      this.appointmentSevice
        .getAll(this.currentPage - 1, this.itemsPerPage)
        .subscribe({
          next: (response: any) => {
            this.appointments = response.content.slice().reverse();
            this.totalRecords = response.totalElements;
          },
          error: (error) => {
            console.error('Error fetching customers:', error);
            this.toastr.error('Lỗi khi tải danh sách khách hàng!');
          },
        });
    }
  
  
    searchCustomers(): void {
      this.appointmentSevice
        .searchAppointments(this.currentPage - 1, this.itemsPerPage, this.searchTerm)
        .subscribe({
          next: (response: any) => {
            console.log('kdie', response)
            this.appointments = response.content;
            this.totalRecords = response.totalElements;
          },
          error: (error: any) => {
            console.error('Error searching customers:', error);
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
        this.searchTerm ? this.searchCustomers() : this.getCustomers();
      }
    }
  
  
    previousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.searchTerm ? this.searchCustomers() : this.getCustomers();
      }
    }
  
    get totalPages(): number {
      return Math.ceil(this.totalRecords / this.itemsPerPage);
    }

  constructor(
    private appointmentSevice: AppointmentService,
    private toastr: ToastrService,
    public util: Util
  ) {}


  delete(id: number) {
    this.appointmentSevice.delete(id).subscribe({
      next: (data) => {
        this.toastr.success('Appointment deleted successfully');
        this.appointments = this.appointments.filter(
          (appointment) => appointment.id !== id
        );
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }
}
