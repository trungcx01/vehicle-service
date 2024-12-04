import { ShopService } from './../../../services/shop.service';
import { ProposalService } from './../../../services/proposal.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrl: './proposal.component.scss',
})
export class ProposalComponent implements OnInit{
  @Input() requestId: any;
  @Input() proposal: any;
  proposalForm: any;
  shopId: any;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private shopService: ShopService,
    private proposalService: ProposalService
  ) {
    this.proposalForm = this.fb.group({
      expectedPrice: ['', Validators.required],
      // responseTime: ['', Validators.required],
      predict: ['', Validators.required],
      status: ['']
    });
  }

  ngOnInit(): void {
    if (this.proposal){
      this.updateForm();
    }
    this.shopService.getCurrent().subscribe({
      next: (res) => {
        this.shopId = res.id;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateForm(){
    this.proposalForm.patchValue({
      expectedPrice: this.proposal.expectedPrice,
      // responseTime: this.proposal.responseTime,
      predict: this.proposal.predict,
      status: this.proposal.status
    })
  }

  submitProposal() {
    const proposal = {
      expectedPrice: this.proposalForm.value.expectedPrice,
      predict: this.proposalForm.value.predict,
      shopId: this.shopId,
      emergencyRequestId: this.requestId
    };
    this.proposalService.createProposal(proposal).subscribe({
      next: (res) => {
        console.log(res);
        this.activeModal.close();
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  closeModal() {
    this.activeModal.close();
  }
}
