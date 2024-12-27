import { EmergencyRequestService } from './../../../services/emergency-request.service';
import { ShopService } from './../../../services/shop.service';
import { ProposalService } from './../../../services/proposal.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrl: './proposal.component.scss',
})
export class ProposalComponent implements OnInit {
  @Input() requestId: any;
  @Input() proposal: any;
  proposalForm: any;
  shopId: any;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private shopService: ShopService,
    private proposalService: ProposalService,
    private emergencyRequestService: EmergencyRequestService
  ) {
    this.proposalForm = this.fb.group({
      expectedPrice: ['', Validators.required],
      // responseTime: ['', Validators.required],
      predict: ['', Validators.required],
      status: [''],
    });
  }

  ngOnInit(): void {
    if (this.proposal) {
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

  updateForm() {
    this.proposalForm.patchValue({
      expectedPrice: this.proposal.expectedPrice,
      // responseTime: this.proposal.responseTime,
      predict: this.proposal.predict,
      status: this.proposal.status,
    });
  }

  submitProposal() {
    const proposal = {
      expectedPrice: this.proposalForm.value.expectedPrice,
      predict: this.proposalForm.value.predict,
      shopId: this.shopId,
      emergencyRequestId: this.requestId,
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

  updateStatus(status: any, proposal: any) {
    Swal.fire({
      title: 'Warning',
      text: 'Bạn có chắc chắn muốn hoàn thành yêu cầu này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, tôi chắc chắn',
      cancelButtonText: 'Hủy',
      backdrop: true, // Làm mờ phần nền ngoài modal
      focusConfirm: false, // Tắt chế độ tự động focus vào nút xác nhận
      position: 'center', // Đặt modal ở giữa màn hình
      iconColor: '#d39e00', // Màu icon cảnh báo
    }).then((result) => {
      if (result.isConfirmed) {
        this.proposalService.updateStatus(status, proposal.id).subscribe({
          next: (res) => {
            console.log(res);
            this.emergencyRequestService
              .updateStatus(status, proposal.emergencyRequest.id)
              .subscribe({
                next: (res) => {
                  console.log(res);
                  this.activeModal.close();
                  window.location.reload();
                },
                error: (err) => {
                  console.log(err);
                },
              });
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }
}
