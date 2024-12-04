import { ShopService } from './../../services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { OthersService } from './../../services/others.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as polyline from '@mapbox/polyline';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentComponent } from '../appointment/appointment.component';

declare var goongjs: any;
declare var GoongGeocoder: any;


@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrl: './shop-detail.component.scss',
})
export class ShopDetailComponent implements OnInit {
  shop: any;
  shopId: any;
  shopLat: number | undefined;
  shopLng: number | undefined;
  currLat: number | undefined;
  currLng: number | undefined;
  bounds = new goongjs.LngLatBounds();
  private map: any;
  private markers: any[] = [];
  constructor(private othersService: OthersService ,private activatedRoute: ActivatedRoute,
    private shopService: ShopService, private cdr: ChangeDetectorRef, private modalService: NgbModal
  ) {}

  
  ngOnInit(): void {
    goongjs.accessToken = environment.mapKey;
    this.map = new goongjs.Map({
      container: 'map',
      zoom: 12,
      style: 'https://tiles.goong.io/assets/goong_map_web.json',
    });
    this.getCurrentLocation();
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      this.shopService.getById(id).subscribe({
        next: (res) => {
          this.shop = res;
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
      centered: true   
    });
    modalRef.componentInstance.shop = this.shop;
  }
}  