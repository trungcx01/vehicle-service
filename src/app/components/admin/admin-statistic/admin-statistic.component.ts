import { Util } from './../../../util';
import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { EmergencyRequestService } from '../../../services/emergency-request.service';
import { PaymentService } from '../../../services/payment.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-admin-statistic',
  templateUrl: './admin-statistic.component.html',
  styleUrl: './admin-statistic.component.scss',
})
export class AdminStatisticComponent implements OnInit {
  selectedTab: string = 'overview';
  overviewData: any; // Thống kê tổng quan
  appointmentChartOptions: any;
  topShopsChartOptions: any;
  userRegistrationChartOptions: any;
  dateStart: any = new Date();
  dateEnd: any = new Date();
  isLoading: boolean = false;

  constructor(
    private appointmentService: AppointmentService,
    private emergencyRequestService: EmergencyRequestService,
    private paymentService: PaymentService,
    private util: Util,
    private userService: UserService // Inject service cho user
  ) {}

  ngOnInit(): void {
    this.initializeCharts();
    this.fetchOverviewData();
    this.fetchUserRegistrationData();
    this.dateStart = this.util.dateToNgbDateStruct(new Date());
    this.dateEnd = this.util.dateToNgbDateStruct(new Date());
  }

  filter() {
    console.log(this.dateStart, this.dateEnd);
  }

  initializeCharts(): void {
    this.appointmentChartOptions = {
      animationEnabled: true,
      exportEnabled: true,
      theme: 'light2',
      title: {
        text: 'Thống kê Lịch hẹn và Yêu cầu cứu trợ',
      },
      axisX: {
        valueFormatString: 'DD/MM',
      },
      axisY: {
        title: 'Số lượng',
        includeZero: false,
      },
      toolTip: {
        shared: true,
      },
      legend: {
        cursor: 'pointer',
        itemclick: (e: any) => {
          if (
            typeof e.dataSeries.visible === 'undefined' ||
            e.dataSeries.visible
          ) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        },
      },
      data: [
        // {
        //   type: "column",
        //   showInLegend: true,
        //   name: "Lịch hẹn",
        //   dataPoints: [
        //     { x: new Date(2024, 0, 1), y: 10 },
        //     { x: new Date(2024, 0, 2), y: 15 },
        //     { x: new Date(2024, 0, 3), y: 5 },
        //     { x: new Date(2024, 0, 4), y: 8 },
        //     { x: new Date(2024, 0, 5), y: 12 },
        //     { x: new Date(2024, 0, 6), y: 9 },
        //     { x: new Date(2024, 0, 7), y: 6 }
        //   ]
        // },
        // {
        //   type: "column",
        //   showInLegend: true,
        //   name: "Yêu cầu cứu trợ",
        //   dataPoints: [
        //     { x: new Date(2024, 0, 1), y: 4 },
        //     { x: new Date(2024, 0, 2), y: 2 },
        //     { x: new Date(2024, 0, 3), y: 3 },
        //     { x: new Date(2024, 0, 4), y: 5 },
        //     { x: new Date(2024, 0, 5), y: 7 },
        //     { x: new Date(2024, 0, 6), y: 6 },
        //     { x: new Date(2024, 0, 7), y: 4 }
        //   ]
        // }
      ],
    };

    this.topShopsChartOptions = {
      animationEnabled: true,
      exportEnabled: true,
      theme: 'light2',
      title: {
        text: 'Top 10 shop có doanh thu cao nhất',
      },
      axisX: {
        title: 'Shop',
        interval: 1,
      },
      axisY: {
        title: 'Doanh thu',
      },
      data: [],
    };

    this.userRegistrationChartOptions = {
      animationEnabled: true,
      exportEnabled: true,
      theme: 'light2',
      title: {
        text: 'Số lượt đăng ký trong 5 tháng gần nhất',
      },
      axisX: {
        title: 'Tháng',
      },
      axisY: {
        title: 'Số lượng người dùng',
      },
      data: [],
    };
  }

  fetchOverviewData(): void {
    // Lấy dữ liệu tổng quan (mô phỏng)
    this.overviewData = {
      totalAppointments: 120,
      totalEmergencyRequests: 45,
      totalRevenue: 1500000,
      totalUsers: 500,
    };
  }

  async fetchAppointmentData(): Promise<void> {
    this.isLoading = true;
    let app_emer_data = [];
    let date = this.dateStart;
    while (
      this.util.ngbDateStructToDate(date) <=
      this.util.ngbDateStructToDate(this.dateEnd)
    ) {
      const [app_count, emer_count] = await Promise.all([
        this.countAppointmentByDate(date),
        this.countEmergencyRequestByDate(date),
      ]);

      app_emer_data.push({
        date: this.util.ngbDateStructToDate(date),
        app_count: app_count,
        emer_count: emer_count,
      });
      const d = this.util.ngbDateStructToDate(date);
      d.setDate(d.getDate() + 1);
      date = this.util.dateToNgbDateStruct(d);
    }
    console.log(app_emer_data);

    this.updateAppointmentChart(app_emer_data);
  }

  updateAppointmentChart(data: any[]): void {
    this.appointmentChartOptions.data = [
      {
        type: 'column',
        showInLegend: true,
        name: 'Lịch hẹn',
        xValueFormatString: 'DD/MM/YYYY',
        dataPoints: data.map((item) => ({ x: item.date, y: item.app_count })),
      },
      {
        type: 'column',
        showInLegend: true,
        name: 'Yêu cầu cứu trợ',
        dataPoints: data.map((item) => ({ x: item.date, y: item.emer_count })),
      },
    ];
    this.isLoading = false;
  }

  async countAppointmentByDate(date: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appointmentService
        .countByDate(this.util.convertDate(date))
        .subscribe({
          next: (data) => {
            console.log(data);
            resolve(data);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  async countEmergencyRequestByDate(date: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.emergencyRequestService
        .countByDate(this.util.convertDate(date))
        .subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  fetchTopShopsData(): void {
    // this.paymentService.getTop10Shops().subscribe((data) => {
    //   this.topShopsChartOptions.data = [
    //     {
    //       type: 'bar',
    //       dataPoints: data.map((shop) => ({
    //         label: shop.name,
    //         y: shop.revenue,
    //       })),
    //     },
    //   ];
    // });
  }

  fetchUserRegistrationData(): void {
    this.isLoading = true;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = [
      (month - 3 > 0 ? month - 3 : month + 9) + '-' + (month - 3 > 0 ? year : year - 1),
      (month - 2 > 0 ? month - 2 : month + 10) + '-' + (month - 2 > 0 ? year : year - 1),
      (month - 1 > 0 ? month - 1 : month + 11) + '-' + (month - 1 > 0 ? year : year - 1),
      month + '-' + year,
      (month + 1 <= 12 ? month + 1 : 1) + '-' + (month + 1 <= 12 ? year : year + 1),
    ];
    console.log(date);
  
    let countUser: any[] = [];

    Promise.all(
      date.map(async (d: any) => {
        const cnt = await this.getUserByMonth(d);
        console.log(cnt);
        return {
          label: d,
          y: cnt,
        };
      })
    )
      .then((result) => {
        countUser = result;
        console.log('iueh', countUser);
  
        this.userRegistrationChartOptions.data = [
          {
            type: 'column',
     
            dataPoints: countUser.map((item: any) => ({
              label: item.label,
              y: item.y,
            })),
          },
        ];

        this.isLoading = true;
  
        console.log('p', this.userRegistrationChartOptions.data);
      })
      .catch((error) => {
        console.error('Error fetching user registration data', error);
      });
  }
  

  async getUserByMonth(d: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getByMonth(d).subscribe({
        next: (data) => {
          console.log('ue', data);
          resolve(data);
        },
        error: (error) => {
          console.log(error);
          reject(error);
        },
      });
    });
  }

  onTabChange(tab: string): void {
    this.selectedTab = tab;

    switch (tab) {
      case 'appointments':
        this.fetchAppointmentData();
        break;
      case 'topShops':
        this.fetchTopShopsData();
        break;
      case 'userRegistrations':
        this.fetchUserRegistrationData();
        break;
      default:
        break;
    }
  }
}
