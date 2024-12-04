import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShopService } from './../../services/shop.service';
import { VehicleCareService } from './../../services/vehicle-care.service';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {
  filteredResults: any[] = [];
  formSearch!: FormGroup;
  type = 'shop'; // Default type
  locations: string[] = ['Location 1', 'Location 2', 'Location 3'];
  priceRanges: string[] = ['0-100', '100-500', '500-1000'];

  constructor(
    private shopService: ShopService,
    private vehicleCareService: VehicleCareService,
    private fb: FormBuilder
  ) {
    this.formSearch = this.fb.group({
      location: [''],
      priceRange: [''],
      query: [''],
      type: ['shop'] // Default type
    });
  }

  ngOnInit(): void {
    this.loadInitialResults();
  }

  loadInitialResults(): void {
    this.shopService.searchShopByName('').subscribe((data: any) => {
      this.filteredResults = data;
    });
  }

  performSearch(): void {
    const formValues = this.formSearch.value;
    console.log(formValues);

    // Extract price range
    const [priceStart, priceEnd] = formValues.priceRange
      ? formValues.priceRange.split('-').map(Number)
      : [0, 1000000000000];

    if (formValues.type === 'vehicleCare') {
      this.type = 'vehicleCare';
      this.vehicleCareService
        .search(formValues.query, priceStart, priceEnd)
        .subscribe((data: any) => {
          this.filteredResults = data;
        });
    } else {
      this.type = 'shop';
      this.shopService
        .searchShopByName(formValues.query)
        .subscribe((data: any) => {
          this.filteredResults = data;
        });
    }
  }

  viewDetails(id: number): void {
    alert(`Viewing details for item ID: ${id}`);
  }

  bookService(id: number): void {
    alert(`Booking service with ID: ${id}`);
  }
}
