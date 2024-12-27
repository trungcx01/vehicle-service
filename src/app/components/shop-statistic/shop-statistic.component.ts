import { Component, OnInit } from '@angular/core';
import { AppointmentService } from './../../services/appointment.service';
import { EmergencyRequestService } from './../../services/emergency-request.service';
import { PaymentService } from './../../services/payment.service'; // Thêm paymentService
import { Util } from '../../util';


@Component({
  selector: 'app-shop-statistic',
  templateUrl: './shop-statistic.component.html',
  styleUrls: ['./shop-statistic.component.scss'],
})
export class ShopStatisticComponent implements OnInit {
  weeks: { startDate: Date; label: string }[] = [];
  chartOptions: any;  
  turnoverChartOptions: any;  
  isLoading: boolean = false;  
  selectedTab: string = 'appointments';  
  sumTurnOver: number = 0;
  dateStart: any;
  dateEnd: any;
  overviewData: any;



  constructor(
    private appointmentService: AppointmentService,
    private emergencyRequestService: EmergencyRequestService,
    private paymentService: PaymentService,
    private util: Util,
  ) {}

  ngOnInit(): void {
    this.initializeCharts();
    this.overviewData = {
      totalAppointments: 120,
      totalEmergencyRequests: 45,
      totalRevenue: 1500000,
      totalUsers: 500,
    };
  }


  async fetchTurnoverData() {
    this.isLoading = true;
    let total_amount: { date: Date; total: any; }[] = [];
    let date = this.dateStart;

    this.sumTurnOver = 0;
    while (this.util.ngbDateStructToDate(date) <= this.util.ngbDateStructToDate(this.dateEnd)) {
      try {
        const data = await this.getTotalAmountByDate(date);
        this.sumTurnOver += data;
        total_amount.push({
          date: this.util.ngbDateStructToDate(date),
          total: data,
        });
      } catch (err) {
        console.log(err); 
      }
  
      const d = this.util.ngbDateStructToDate(date);
      d.setDate(d.getDate() + 1);
      date = this.util.dateToNgbDateStruct(d); 
    }
  
    console.log(total_amount);
    this.updateTurnoverChart(total_amount);
  }
  
  async getTotalAmountByDate(date: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.paymentService.totalAmountByDateAndCurrentShop(this.util.convertDate(date)).subscribe({
        next: (data) => resolve(data), 
        error: (err) => reject(err), 
      });
    });
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

  async countAppointmentByDate(date: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appointmentService
        .countByDateAndCurrentShop(this.util.convertDate(date))
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
        .countByDateAndCurrentShop(this.util.convertDate(date))
        .subscribe({
          next: (data) => {
            console.log(data)
            resolve(data);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  initializeCharts(): void {
    this.chartOptions = {
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
      ],
    };

    this.turnoverChartOptions = {
      animationEnabled: true,
      exportEnabled: true,
      theme: 'light2',
      title: {
        text: 'Thống kê Doanh thu',
      },
      axisX: {
        valueFormatString: 'DD/MM',
      },
      axisY: {
        title: 'Doanh thu',
        includeZero: false,
      },
      toolTip: {
        shared: true,
      },
      legend: {
        cursor: 'pointer',
        itemclick: (e: any) => {
          if (typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        },
      },
      data: [],
    };
  }


  updateAppointmentChart(data: any[]): void {
    this.chartOptions.data = [
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

  updateTurnoverChart(data: any[]): void {
    this.turnoverChartOptions.data = [
      {
        type: 'line',
        showInLegend: true,
        name: 'Doanh thu',
        dataPoints: data.map((item) => ({ x: item.date, y: item.total })),
      },
    ];
    this.isLoading = false;
  }
}
