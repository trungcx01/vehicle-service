import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from './../../services/proposal.service';
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
          this.isNavigatingBack = true; // Tránh xử lý lặp
          this.router.navigate(['']); // Chuyển hướng về trang chủ
        } else {
          // Đẩy trạng thái vào lịch sử để giữ user ở trang hiện tại
          history.pushState(null, '', window.location.href);
        }
      }
    };

    this.activatedRoute.paramMap.subscribe((params) => {
      this.erId = params.get('erId');
      this.getProposals();
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

  acceptProposal(proposalId: number): void {
    this.proposalService.acceptProposal(proposalId).subscribe({
      next: (res) => {
        console.log(res);
        setTimeout(() =>{
          this.router.navigate(['/map-emergency', proposalId]);
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
}
