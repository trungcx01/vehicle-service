import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { EmergencyRequestService } from '../../../services/emergency-request.service';
import { PaymentService } from '../../../services/payment.service'; // Added paymentService
import { Util } from '../../../util';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from '../../../services/shop.service';

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
  selectedTab: string = 'overview';
  sumTurnOver: number = 0;
  dateStart: any;
  dateEnd: any;
  overviewData: any;
  appointment_emergency_data: any;

  minDate = new NgbDate(2000, 1, 1);
  maxDate = new NgbDate(2030, 12, 31);



  currentPage = 1;
  itemsPerPage = 10;
  paginatedData: any;


  turnoverCurrentPage = 1;
  turnoverItemsPerPage = 10;
  turnover_data: any;


  get totalPages() {
    return Array.from(
      { length: Math.ceil(this.appointment_emergency_data?.length / this.itemsPerPage) },
      (_, i) => i + 1
    );
  }

  get turnoverTotalPages() {
    return Array.from(
      { length: Math.ceil(this.turnover_data?.length / this.turnoverItemsPerPage) },
      (_, i) => i + 1
    );
  }

  constructor(
    private appointmentService: AppointmentService,
    private emergencyRequestService: EmergencyRequestService,
    private paymentService: PaymentService,
    private shopService: ShopService,
    private toastr: ToastrService,
    private util: Util,
  ) {}

  async ngOnInit(): Promise<void> {
    this.initializeCharts();
    const x = await this.countAppointment();
    const y = await this.countEmergencyRequest();
    this.overviewData = {
      totalAppointments: x,
      totalEmergencyRequests: y,
      totalRevenue: (await this.getCurrentShop()).revenue,
    };
  }

  calculateDateDifference(): number {
    if (this.dateStart && this.dateEnd) {
      const start = new Date(this.dateStart.year, this.dateStart.month - 1, this.dateStart.day);
      const end = new Date(this.dateEnd.year, this.dateEnd.month - 1, this.dateEnd.day);
    const startTime = start.getTime();
    const endTime = end.getTime();
    const timeDifference = endTime - startTime;
  
    const dayDifference = timeDifference / (1000 * 3600 * 24);
  
    return Math.abs(dayDifference); 
    }
    return 0;
  }
  

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
      this.paginatedData = this.getPaginatedData();
    }
  }


  changeTurnoverPage(page: number) {
    if (page >= 1 && page <= this.turnoverTotalPages.length) {
      this.turnoverCurrentPage = page;
    }
  }


  getPaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.appointment_emergency_data.slice(start, end);
  }


  get paginatedTurnoverData() {
    const start = (this.turnoverCurrentPage - 1) * this.turnoverItemsPerPage;
    const end = start + this.turnoverItemsPerPage;
    return this.turnover_data.slice(start, end);
  }


  validateDateRange(): boolean {
    if (this.dateStart && this.dateEnd) {
      const start = new Date(this.dateStart.year, this.dateStart.month - 1, this.dateStart.day);
      const end = new Date(this.dateEnd.year, this.dateEnd.month - 1, this.dateEnd.day);
      const today = new Date(); 

      if (end > today) {
        this.toastr.error('Bạn không thể chọn ngày kết thúc vượt quá hôm nay', 'Lỗi');
        return false;
      } else{
        if (end < start) {
          this.toastr.error('Ngày kết thúc không thể nhỏ hơn ngày bắt đầu', 'Lỗi');
          return false;
        }
  
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = diffTime / (1000 * 3600 * 24); 
  
        if (diffDays > 60) {
          this.toastr.error('Khoảng cách giữa ngày bắt đầu và ngày kết thúc không thể quá 60 ngày', 'Lỗi');
          return false;
        }
      }

      return true; 
    }

    return true; 
  }

  // Fetch turnover data and update chart
  async fetchTurnoverData() {
    if (this.validateDateRange() === true){
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
    this.turnover_data = total_amount;
    this.updateTurnoverChart(total_amount);
    }
    
  }

  // Helper method to get total amount by date for turnover
  async getTotalAmountByDate(date: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.paymentService.totalAmountByDateAndCurrentShop(this.util.convertDate(date)).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err),
      });
    });
  }

  // Fetch appointment and emergency data and update chart
  async fetchAppointmentData(): Promise<void> {
    if (this.validateDateRange() === true){
      this.isLoading = true;
      let app_emer_data = [];
      let date = this.dateStart;
      while (this.util.ngbDateStructToDate(date) <= this.util.ngbDateStructToDate(this.dateEnd)) {
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
      this.appointment_emergency_data = app_emer_data;
      this.paginatedData = this.getPaginatedData();
  
      this.updateAppointmentChart(app_emer_data);
    }
    
  }

  // Helper method to count appointments by date
  async countAppointmentByDate(date: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appointmentService.countByDateAndCurrentShop(this.util.convertDate(date)).subscribe({
        next: (data) => resolve(data),
        error: (error) => reject(error),
      });
    });
  }

  // Helper method to count emergency requests by date
  async countEmergencyRequestByDate(date: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.emergencyRequestService.countByDateAndCurrentShop(this.util.convertDate(date)).subscribe({
        next: (data) => resolve(data),
        error: (error) => reject(error),
      });
    });
  }

  // Initialize chart options for appointments and turnover
  initializeCharts(): void {
    this.chartOptions = {
      animationEnabled: true,
      exportEnabled: true,
      backgroundColor: "#ffffff",
      theme: "light2", // Sử dụng theme sáng
      title: {
        text: "Thống kê Lịch hẹn và Cứu trợ",
        fontSize: 20,
        fontWeight: "bold",
        margin: 15,
      },
      axisX: {
        title: "Ngày",
        titleFontSize: 14,
        labelFontSize: 12,
        labelFontColor: "#555",
        gridColor: "#e0e0e0",
   
       
      },
      axisY: {
        title: "Số lượng",
        titleFontSize: 14,
        labelFontSize: 12,
        labelFontColor: "#555",
        gridColor: "#e0e0e0",
      },
      toolTip: { shared: true },
      legend: {
        cursor: 'pointer',
        itemclick: (e: any) => {
          e.dataSeries.visible = e.dataSeries.visible === undefined || e.dataSeries.visible ? false : true;
          e.chart.render();
        },
      },
      data: [],
    };

    this.turnoverChartOptions = {
      animationEnabled: true,
      exportEnabled: true,
      backgroundColor: "#ffffff",
      theme: "light2", // Sử dụng theme sáng
      title: {
        text: "Thống kê Doanh thu",
        fontSize: 20,
        fontWeight: "bold",
        margin: 15,
      },
      axisX: {
        title: "Ngày",
        titleFontSize: 14,
        labelFontSize: 12,
        labelFontColor: "#555",
        gridColor: "#e0e0e0",
         valueFormatString: 'DD/MM'
      },
      axisY: {
        title: "Doanh thu",
        titleFontSize: 14,
        labelFontSize: 12,
        labelFontColor: "#555",
        gridColor: "#e0e0e0",
        includeZero: false
      },
      toolTip: { shared: true },
      legend: {
        cursor: 'pointer',
        itemclick: (e: any) => {
          e.dataSeries.visible = e.dataSeries.visible === undefined || e.dataSeries.visible ? false : true;
          e.chart.render();
        },
      },
      data: [],
    };
  }

  // Update appointment chart with new data
  updateAppointmentChart(data: any[]): void {
    this.chartOptions.axisX= {
      ...this.chartOptions.axisX,
      valueFormatString: 'DD/MM',
      interval: this.calculateDateDifference() < 10 ? 1 : null,
      intervalType: "day",
    }
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

  // Update turnover chart with new data
  updateTurnoverChart(data: any[]): void {
    this.turnoverChartOptions.axisX= {
      ...this.turnoverChartOptions.axisX,
      valueFormatString: 'DD/MM',
      interval: this.calculateDateDifference() < 10 ? 1 : null,
      intervalType: "day",
    }
    this.turnoverChartOptions.data = [
      {
        type: 'column',
        showInLegend: true,
        name: 'Doanh thu',
        dataPoints: data.map((item) => ({ x: item.date, y: item.total })),
      },
    ];
    this.isLoading = false;
  }

  async countAppointment(): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.appointmentService.countByCurrentShop().subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) =>{
          reject(err);
        }
      })
    })

  }

  async countEmergencyRequest(): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.emergencyRequestService.countByCurrentShop().subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) =>{
          reject(err);
        }
      })
    })
  }

  
  async getCurrentShop(): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.shopService.getCurrent().subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) =>{
          reject(err);
        }
      })
    })
  }

  // Handle tab change to load relevant data
  onTabChange(tab: string): void {
    this.selectedTab = tab;

    switch (tab) {
      case 'overview':
        this.dateStart = null;
        this.dateEnd = null;
        this.appointment_emergency_data = null;
        this.turnover_data = null;
        break;
      case 'appointments':
        this.dateStart = null;
        this.dateEnd = null;
        this.appointment_emergency_data = null;
        this.turnover_data = null;
        break;
      case 'turnover':
        this.dateStart = null;
        this.dateEnd = null;
        this.appointment_emergency_data = null;
        this.turnover_data = null;
        break;
      default:
        break;
    }
  }
}
