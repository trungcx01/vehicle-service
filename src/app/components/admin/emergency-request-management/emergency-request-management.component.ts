import { Component, OnInit } from '@angular/core';
import { EmergencyRequestService } from '../../../services/emergency-request.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-emergency-request-management',
  templateUrl: './emergency-request-management.component.html',
  styleUrl: './emergency-request-management.component.scss',
})
export class EmergencyRequestManagementComponent implements OnInit {
  emergencyRequests: any[] = [];
  constructor(
    private emergencyRequestService: EmergencyRequestService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.emergencyRequestService.getAll().subscribe({
      next: (response) => {
        console.log(response);
        this.emergencyRequests = response.content;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
