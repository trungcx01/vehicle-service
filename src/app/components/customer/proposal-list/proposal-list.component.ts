import { EmergencyRequestService } from '../../../services/emergency-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from '../../../services/proposal.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrl: './proposal-list.component.scss',
})
export class ProposalListComponent implements OnInit {
  proposals: any[] = [];
  hasProposal: boolean = false;
  erId: any;
  isNavigatingBack = false;

  constructor(
    private proposalService: ProposalService,
    private activatedRoute: ActivatedRoute,
    private emergencyRequestService: EmergencyRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    history.pushState(null, '', window.location.href);

    window.onpopstate = () => {
      if (!this.isNavigatingBack) {
        const confirmLeave = confirm(
          'Bạn có chắc muốn thoát? Bạn sẽ được chuyển về trang chủ.'
        );

        if (confirmLeave) {
          this.isNavigatingBack = true; 
          this.router.navigate(['']); 
        } else {
          history.pushState(null, '', window.location.href);
        }
      }
    };

    this.activatedRoute.paramMap.subscribe((params) => {
      this.erId = params.get('erId');
      this.getProposals();
      this.checkEmergencyRequestStatus()
      setTimeout(() => {
        if (!this.hasProposal) {
          this.showNoProposalNotification();
        }
      }, 15 * 60 * 1000);
    });
  }

  getProposals(): void {
    this.proposalService.getListProposals(this.erId).subscribe({
      next: (res) => {
        this.proposals = res;
        this.hasProposal = res.length;
        console.log(res);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  acceptProposal(proposal: any): void {
    this.proposalService.acceptProposal(proposal.id).subscribe({
      next: (res) => {
        console.log(res);
        setTimeout(() => {
          this.router.navigate(['/payment', 'proposal', proposal.id]);
        }, 1000);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  showNoProposalNotification(): void {
    Swal.fire({
      title: 'Rất tiếc!',
      text: 'Không có cửa hàng nào gửi đề xuất cứu trợ trong vòng 15 phút. Bạn có thể thử lại hoặc liên hệ với tổng đài.',
      icon: 'error',
      confirmButtonText: 'Ok',
    });
  }

  checkEmergencyRequestStatus(): void {
    this.emergencyRequestService.getById(this.erId).subscribe({
      next: (emergencyRequest) => {
        const status = emergencyRequest.requestStatus; 
        if (status === 'FINISHED' || status === 'CANCELED' || status === 'IN_PROGRESS') {
          this.showCompletionNotification(status);
        }
      },
      error: (error) => {
        console.error('Failed to fetch Emergency Request:', error);
      },
    });
  }

  showCompletionNotification(status: string): void {
    const message =
      status === 'FINISHED'
        ? 'Yêu cầu cứu trợ đã được hoàn thành. Bạn sẽ được chuyển về trang danh sách yêu cầu.'
        : (status === 'CANCELED' ? 'Yêu cầu cứu trợ đã bị hủy. Bạn sẽ được chuyển về trang danh sách yêu cầu.' : 'Yêu cầu cứu trợ đang được thực hiện. Bạn sẽ được chuyển về trang danh sách yêu cầu.')

    Swal.fire({
      title: 'Thông báo!',
      text: message,
      icon: 'info',
      confirmButtonText: 'Ok',
    }).then(res =>{
      this.router.navigate(['/emergency-requests']); 
    });
  }
}
