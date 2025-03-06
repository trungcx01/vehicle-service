import { Util } from './../../../util';
import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { EmergencyRequestService } from '../../../services/emergency-request.service';
import { PaymentService } from '../../../services/payment.service';
import { UserService } from '../../../services/user.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ShopService } from '../../../services/shop.service';
import { ToastrService } from 'ngx-toastr';


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
  dateStart: any;
  dateEnd: any;
  isLoading: boolean = false;
  monthStart: NgbDateStruct | undefined; 
  monthEnd: NgbDateStruct | undefined;  
  top_shop_data: any;
  app_emergency_data: any;
  user_registration_data: any;

  constructor(
    private appointmentService: AppointmentService,
    private emergencyRequestService: EmergencyRequestService,
    private paymentService: PaymentService,
    private util: Util,
    private userService: UserService,
    private shopService: ShopService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeCharts();
    this.fetchOverviewData();
    this.updateUserRegistrationPaginatedData();
    this.updatePaginatedData();
  }
  currentPage = 1;
  itemsPerPage = 10;
  paginatedData: any;
  
  userRegistrationCurrentPage = 1;
  userRegistrationItemsPerPage = 10;
  userRegistrationPaginatedData: any;
  

  get totalPages() {
    return Array.from(
      { length: Math.ceil(this.app_emergency_data?.length / this.itemsPerPage) },
      (_, i) => i + 1
    );
  }
  
  get userRegistrationTotalPages() {
    return Array.from(
      { length: Math.ceil(this.user_registration_data?.length / this.userRegistrationItemsPerPage) },
      (_, i) => i + 1
    );
  }
  
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }
  

  changeUserRegistrationPage(page: number) {
    if (page >= 1 && page <= this.userRegistrationTotalPages.length) {
      this.userRegistrationCurrentPage = page;
      this.updateUserRegistrationPaginatedData();
    }
  }
  
  updatePaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.app_emergency_data.slice(start, end);
  }
  

  updateUserRegistrationPaginatedData() {
    const start = (this.userRegistrationCurrentPage - 1) * this.userRegistrationItemsPerPage;
    const end = start + this.userRegistrationItemsPerPage;
    this.userRegistrationPaginatedData = this.user_registration_data.slice(start, end);
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

  initializeCharts(): void {
  this.appointmentChartOptions = {
    animationEnabled: true,
    exportEnabled: true,
    backgroundColor: "#ffffff", 
    theme: "light2", 
    title: {
      text: "Thống kê Lịch hẹn và Yêu cầu cứu trợ",
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
      valueFormatString: "DD/MM",
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
    dpiScale: window.devicePixelRatio || 1,
    data: [], 
  };


  this.topShopsChartOptions = {
    animationEnabled: true,
    exportEnabled: true,
    backgroundColor: "#ffffff", 
    theme: "light2", 
    // title: {
    //   text: "Top 10 Shop có doanh thu cao nhất",
    //   fontSize: 20,
    //   fontWeight: "bold",
    //   margin: 15, 
    // },
    axisX: {
      title: "Shop",
      titleFontSize: 14,
      labelFontSize: 12,
      labelFontColor: "#555",
      gridColor: "#e0e0e0",
    },
    axisY: {
      title: "Doanh thu",
      maximum: 1000000,
      titleFontSize: 14,
      labelFontSize: 12,
      labelFontColor: "#555", 
      gridColor: "#e0e0e0", 
    },
    legend: {
      cursor: 'pointer',
      itemclick: (e: any) => {
        e.dataSeries.visible = e.dataSeries.visible === undefined || e.dataSeries.visible ? false : true;
        e.chart.render();
      },
    },
    dpiScale: window.devicePixelRatio || 1,
    data: [], 
  };

  // User Registration Chart
  this.userRegistrationChartOptions = {
    animationEnabled: true,
    exportEnabled: true,
    backgroundColor: "#ffffff", 
    theme: "light2",
    title: {
      text: "Số lượt Đăng ký Người dùng",
      fontSize: 20,
      fontWeight: "bold",
      margin: 15, 
    },
    axisX: {
      title: "Tháng",
      titleFontSize: 14,
      labelFontSize: 12,
      labelFontColor: "#555", 
      gridColor: "#e0e0e0", 
    },
    axisY: {
      title: "Số lượng người dùng",
      titleFontSize: 14,
      labelFontSize: 12,
      labelFontColor: "#555", 
      gridColor: "#e0e0e0", 
    },
    dpiScale: window.devicePixelRatio || 1,
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

  

  async fetchOverviewData(): Promise<void> {
    const x = await this.countAppointment();
    const y = await this.countEmergencyRequest();
    const z = await this.getTotalRevenue()
        // Lấy dữ liệu tổng quan (mô phỏng)
    this.overviewData = {
      totalAppointments: x,
      totalEmergencyRequests: y,
      totalRevenue: z,
      totalUsers: (await this.countUser()),
    };
  }

  async fetchAppointmentData(): Promise<void> {
    if (this.validateDateRange()){
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
    this.app_emergency_data = app_emer_data;
    this.updatePaginatedData();
    this.updateAppointmentChart(app_emer_data);
    }
  }

  updateAppointmentChart(data: any[]): void {
    this.appointmentChartOptions.axisX= {
      ...this.appointmentChartOptions.axisX,
      valueFormatString: 'DD/MM',
      interval: this.calculateDateDifference() < 10 ? 1 : null,
      intervalType: "day",
    }
    this.appointmentChartOptions.data = [
      {
        type: 'column',
        showInLegend: true,
        name: 'Lịch hẹn',
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

  updateUserRegistrationChart(data: any[]){
    this.userRegistrationChartOptions.axisX= {
      ...this.userRegistrationChartOptions.axisX,
      valueFormatString: 'DD/MM',
      interval: this.calculateDateDifference() < 10 ? 1 : null,
      intervalType: "day",
    }
    this.userRegistrationChartOptions.data = [
      {
        type: 'column',
        showInLegend: true,
        name: 'Số lượng đăng kí mới',
        dataPoints: data.map((item) => ({ x: item.date, y: item.user_cnt })),
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

  async fetchTopShopsData(): Promise<void> {
    this.isLoading = true;
    const top10Shop = await this.getTop10Revenue();
    const data = top10Shop.map((s: any)=>{
      return {
        shopName: s.name,
        revenue: s.revenue,
      }
    })
    this.top_shop_data = data;
    console.log(data)
    this.updateTop10ShopChart(data);
  }

  async getTop10Revenue(): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.shopService.getTop10Revenue().subscribe({
        next: (res) =>{
          resolve(res);
        },
        error: (error) =>{
          reject(error);
        }
      })
    })
  }

  updateTop10ShopChart(data: any[]){
    const maxRevenue = Math.max(...data.map((item) => item.revenue));
    this.topShopsChartOptions.axisY = {
      ... this.topShopsChartOptions.axisY,
      maximum: maxRevenue * 1.5,
    }
    this.topShopsChartOptions.data = [
      {
        type: 'column',
        showInLegend: true,
        name: 'Top 10 cửa hàng có doanh thu cao nhất',
        dataPoints: data.map((item) => ({ label: item.shopName, y: item.revenue })),
      },
    ];
    this.isLoading = false;
  }

  async fetchUserRegistrationData(): Promise<void>{
   if (this.validateDateRange()){
    this.isLoading = true;
    let countUser: any[] = [];
    let date = this.dateStart;
    while (
      this.util.ngbDateStructToDate(date) <=
      this.util.ngbDateStructToDate(this.dateEnd)
    ) {
      const user_cnt = await this.getUserByDate(date);
      countUser.push({
        date: this.util.ngbDateStructToDate(date),
        user_cnt: user_cnt,
      });
      const d = this.util.ngbDateStructToDate(date);
      d.setDate(d.getDate() + 1);
      date = this.util.dateToNgbDateStruct(d);
    }

    console.log(countUser);
    this.user_registration_data = countUser;
    this.updateUserRegistrationPaginatedData();
    this.updateUserRegistrationChart(countUser);
   }
  }
  

  async getUserByDate(d: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getByDate(this.util.convertDate(d)).subscribe({
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

  async getTotalRevenue(): Promise<any>{
   return new Promise((resolve, reject) =>{
      this.paymentService.getTotalRevenue().subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) =>{
          reject(err);
        }
      })
    })

  }

  async countAppointment(): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.appointmentService.count().subscribe({
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
      this.emergencyRequestService.count().subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) =>{
          reject(err);
        }
      })
    })
  }

  async countUser(): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.userService.count().subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) =>{
          reject(err);
        }
      })
    })

  }
  onTabChange(tab: string): void {
    this.selectedTab = tab;

    switch (tab) {
      case 'appointments':
        this.dateStart = null;
        this.dateEnd = null;
        this.app_emergency_data = null;
        this.user_registration_data = null;
        break;
      case 'topShops':
        this.dateStart = null;
        this.dateEnd = null;
        this.app_emergency_data = null;
        this.user_registration_data = null;
        this.fetchTopShopsData()
        break;
      case 'userRegistrations':
        this.dateStart = null;
        this.dateEnd = null;
        this.app_emergency_data = null;
        this.user_registration_data = null;
        break;
      default:
        break;
    }
  }

}
