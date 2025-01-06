import { ShopService } from './../../services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { OthersService } from './../../services/others.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as polyline from '@mapbox/polyline';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentComponent } from '../appointment/appointment.component';
import { ReviewService } from '../../services/review.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { VehicleCareService } from '../../services/vehicle-care.service';

declare var goongjs: any;
declare var GoongGeocoder: any;


@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrl: './shop-detail.component.scss',
})
export class ShopDetailComponent implements OnInit {
  shop: any;
  reviews: any[] = [];
 
  shopLat: number | undefined;
  shopLng: number | undefined;
  currLat: number | undefined;
  currLng: number | undefined;
  reviewForm!: FormGroup
  bounds = new goongjs.LngLatBounds();
  private map: any;
  private markers: any[] = [];
  previewImage: any
  image: any;
  color: any;
  customer: any;
  vehicleCares: any[] = []

  averageRating: number = 0;
  totalReviews: number = 0;
  ratingCounts: { [key: number]: number } = {};


  constructor(private othersService: OthersService ,private activatedRoute: ActivatedRoute,
    private shopService: ShopService, private cdr: ChangeDetectorRef, private modalService: NgbModal,
    private reviewService: ReviewService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private vehicleCareService: VehicleCareService
  ) {
  }

  calculateRatings(): void {
    if (this.reviews && this.reviews.length > 0) {
      this.totalReviews = this.reviews.length;
      this.averageRating =
        this.reviews.reduce((sum, review) => sum + review.rate, 0) /
        this.totalReviews;

      this.ratingCounts = this.reviews.reduce((counts, review) => {
        counts[review.rate] = (counts[review.rate] || 0) + 1;
        return counts;
      }, {});
    }
  }

  getStarPercentage(star: number): number {
    return this.ratingCounts[star]
      ? (this.ratingCounts[star] / this.totalReviews) * 100
      : 0;
  }

  getReviewerAvatar(review: any): string {
    return review.serviceType === 'APPOINTMENT'
      ? review.baseService.customer.user.imageUrl
      : review.baseService.emergencyRequest.customer.user.imageUrl;
  }

  getReviewerName(review: any): string {
    return review.serviceType === 'APPOINTMENT'
      ? review.baseService.customer.name
      : review.baseService.emergencyRequest.customer.name;
  }


  async getAllVehicleCareOfShop(id: number) : Promise<any>{
    return new Promise((resolve, reject) =>{
      this.vehicleCareService.getByShop(id).subscribe({
        next: (response) => {
         resolve(response)
        },
        error: (err) =>{
        reject(err);
          console.log(err);
        }
      })
    })
  }
  
  getRatingStars(averageRating: number): string {
    const fullStars = Math.round(averageRating); // Số sao đầy
    const emptyStars = 5 - fullStars; // Số sao rỗng
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  }
  
  
  async ngOnInit(){
    goongjs.accessToken = environment.mapKey;
    this.map = new goongjs.Map({
      container: 'map',
      zoom: 12,
      style: 'https://tiles.goong.io/assets/goong_map_web.json',
    });
    this.getCurrentLocation();
    this.activatedRoute.params.subscribe(async params => {
      const id = params['id'];
      this.vehicleCares = await this.getAllVehicleCareOfShop(id);
      this.shopService.getById(id).subscribe({
        next: async (res) => {
          this.shop = res;
          this.reviews = await this.getAllReviewsOfShop(res.id);
          this.calculateRatings();
          this.cdr.detectChanges();
          console.log('oi', this.shop.address);
          this.convertToLatLng(this.shop.address);
        },
        error: (err) => {
          console.error(err);
        }
       })
    });
   
    
  
   

    this.map.on('load', () => {
      this.initMarker([
        { name: "Shop",
          coord: [this.shopLng, this.shopLat] },
        { name: "You",
          coord: [this.currLng, this.currLat] },
      ]);
      // this.map.setCenter([this.shopLng, this.shopLat]);
      console.log(this.markers);
      this.map.fitBounds(this.bounds, {
        padding: 100,
      });

      this.getDirectionLines();
    });

    this.customer = await this.getCurrentCustomer();
    console.log('oll',this.customer);
  }

  async getCurrentCustomer(): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.customerService.getCurrentCustomer().subscribe({
        next: (res) =>{
          resolve(res);
        }, 
        error: (error) =>{
          reject(error);
          console.log(error);
        }
      })
    })
  }

  initMarker(locations: any): void {
    locations.forEach((e: any) => {
      const popup = new goongjs.Popup({ offset: 35,  closeButton: false  }).setText(e.name).addTo(this.map);
      const marker = new goongjs.Marker().setLngLat(e.coord).setPopup(popup).addTo(this.map);
      this.markers.push(marker);
      this.bounds.extend(e.coord);
    });
  }

  convertToLatLng(address: string): void {
    this.othersService.getLatLng(address).subscribe({
      next: (data) => {
        this.shopLat = data.results[0].geometry.location.lat;
        this.shopLng = data.results[0].geometry.location.lng;
        console.log(this.shopLat, this.shopLng);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currLat = position.coords.latitude;
        this.currLng = position.coords.longitude;
        console.log(this.currLat, this.currLng);
      });
    }
  }

 

  async getAllReviewsOfShop(id: number): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.reviewService.getByShop(id).subscribe({
        next: (data) =>{
          console.log('fjkckd', data);
          resolve(data);
          
        },
        error: (error) =>{
          reject(error);
        }
      })
    })
  }

  getDirectionLines(): void {
    const origin = this.currLat + "," + this.currLng
    const destination = this.shopLat + "," + this.shopLng;
  
    console.log("Fetching directions from:", origin, "to:", destination);
  
    this.othersService.getDirections(origin, destination).subscribe({
      next: (response) => {  
        const route = response.routes[0];
        console.log('Route details:', route);
  
        const geometryString = route.overview_polyline?.points;

        let coordinates = polyline.decode(geometryString).map((coord: number[]) => [coord[1], coord[0]]);
        coordinates = coordinates.filter(([lng, lat]) => !isNaN(lng) && !isNaN(lat));
        console.log('Filtered coordinates:', coordinates);

        this.map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates
            }
          }
        });
  
        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#1fe80d',
            'line-width': 7
          }
        });
      },
      error: (err) => {
        console.error('Error fetching directions:', err);
      }
    });
  }

  

  openAppointmentModal() {
    const modalRef = this.modalService.open(AppointmentComponent, { 
      // backdrop: 'static',
      // keyboard: false,
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.shop = this.shop;
  }
}  