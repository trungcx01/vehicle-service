import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrl: './activation.component.scss',
})
export class ActivationComponent implements OnInit{
  activationCode: string = '';
  @Input() email: any;
  constructor(
    public activeModal: NgbActiveModal,
    protected authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
     
  }
  

  closeModal() {
    this.activeModal.dismiss();
  }
}
