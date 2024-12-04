import { AppointmentService } from './../../services/appointment.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.scss',
})
export class AppointmentHistoryComponent implements OnInit {
  appointments: any[] = []

  constructor(private router: Router, private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.appointmentService.getAppointmentByCurrentCustomer().subscribe({
      next: (response) => {
        this.appointments = response;
        console.log(this.appointments);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  navToPayment(id: number){
    this.router.navigate(['/payment', id]);
  }
}
