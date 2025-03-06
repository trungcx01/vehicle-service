import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShopService } from '../../../services/shop.service';
import { VehicleCareService } from '../../../services/vehicle-care.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentComponent } from '../appointment/appointment.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {
  filteredResults: any[] = [];
  formSearch!: FormGroup;
  type: any; 
  locations: string[] = ['Location 1', 'Location 2', 'Location 3'];
  priceRanges: string[] = ['0 - 20.000 VNĐ', '20.000 VNĐ - 50.000 VNĐ', '50.000 VNĐ - 100.000 VNĐ', '100.000 VNĐ - 200.000 VNĐ', '200.000 VNĐ-500.000 VNĐ'];
  districts = [
    { id: 1, name: 'Ba Đình' },
    { id: 2, name: 'Hoàn Kiếm' },
    { id: 3, name: 'Tây Hồ' },
    { id: 4, name: 'Long Biên' },
    { id: 5, name: 'Cầu Giấy' },
    { id: 6, name: 'Đống Đa' },
    { id: 7, name: 'Hai Bà Trưng' },
    { id: 8, name: 'Hoàng Mai' },
    { id: 9, name: 'Thanh Xuân' },
    { id: 10, name: 'Nam Từ Liêm' },
    { id: 11, name: 'Bắc Từ Liêm' },
    { id: 12, name: 'Hà Đông' },
    { id: 13, name: 'Sơn Tây' },
    { id: 14, name: 'Ba Vì' },
    { id: 15, name: 'Chương Mỹ' },
    { id: 16, name: 'Đan Phượng' },
    { id: 17, name: 'Hoài Đức' },
    { id: 18, name: 'Mỹ Đức' },
    { id: 19, name: 'Phú Xuyên' },
    { id: 20, name: 'Thường Tín' },
    { id: 21, name: 'Thanh Oai' },
    { id: 22, name: 'Gia Lâm' },
    { id: 23, name: 'Ứng Hòa' },
    { id: 24, name: 'Sóc Sơn' },
    { id: 25, name: 'Mê Linh' },
    { id: 26, name: 'Tây Hồ' },
    { id: 27, name: 'Vĩnh Phúc' }
  ];
  

  constructor(
    private shopService: ShopService,
    private vehicleCareService: VehicleCareService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.formSearch = this.fb.group({
      district: [''],
      priceRange: [''],
      query: [''],
      rating: [0],
      type: [this.type]
    });
  }

  ngOnInit(): void {
    if (this.router.url.endsWith("/vehicle-care-list")){
      this.type = 'vehicleCare'
    }else{
      this.type = 'shop'
    }
    this.loadInitialResults();
  }

  loadInitialResults(): void {
   if (this.type === 'shop'){
    this.shopService.searchShop('','',0).subscribe((data: any) => {
      this.filteredResults = data;
    });
   }else{
    this.vehicleCareService.search('','',0, 100000000).subscribe((data: any) => {
      this.filteredResults = data;
    });
   }
  }

  performSearch(): void {
    const { query, district, priceRange, type, rating } = this.formSearch.value;

    const [priceStart, priceEnd] = this.getPriceRange(priceRange);

    if (type === 'vehicleCare') {
      this.type = 'vehicleCare';
      this.vehicleCareService
        .search(query || '', district || '', priceStart, priceEnd)
        .subscribe((data: any) => {
          this.filteredResults = data;
        });
    } else {
      this.type = 'shop';
      this.shopService
        .searchShop(query || '', district || '', rating)
        .subscribe((data: any) => {
          this.filteredResults = data;
        });
    }
  }

  private getPriceRange(priceRange: string | null): [number, number] {
    if (!priceRange) {
      return [0, 1000000000]; 
    }
    const [start, end] = priceRange.replace(/ VNĐ/g, '').replace(/\./g, '').trim().split('-').map(Number);
    return [start || 0, end || 100000000]; 
  }

  viewDetails(id: number): void {
    alert(`Viewing details for item ID: ${id}`);
  }

  bookService(id: number): void {
    alert(`Booking service with ID: ${id}`);
  }

  openAppointmentModal(shop: any, vehicleCare: any) {
      const modalRef = this.modalService.open(AppointmentComponent, { 
        // backdrop: 'static',
        // keyboard: false,
        centered: true,
        size: 'lg'
      });
      modalRef.componentInstance.shop = shop;
      modalRef.componentInstance.vehicleCare = vehicleCare;
    }
}
