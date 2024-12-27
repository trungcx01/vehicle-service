import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointment-management',
  templateUrl: './appointment-management.component.html',
  styleUrl: './appointment-management.component.scss'
})
export class AppointmentManagementComponent implements OnInit{
  appointments: any[] = [];
  constructor(private appointmentSevice: AppointmentService, private toastr: ToastrService){}

  ngOnInit(): void {
      this.appointmentSevice.getAll().subscribe({
        next: (data) => {
          this.appointments = data.content;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      })
  }

  delete(id: number){
    this.appointmentSevice.delete(id).subscribe({
      next: (data) => {
        this.toastr.success('Appointment deleted successfully');
        this.appointments = this.appointments.filter(appointment => appointment.id !== id);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })
  }
}
