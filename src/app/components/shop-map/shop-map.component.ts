
import { NotificationService } from './../../services/notification.service';
import { ProposalService } from './../../services/proposal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OthersService } from '../../services/others.service';
import polyline from '@mapbox/polyline';
import { Toast } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';



declare var goongjs: any;
declare var GoongGeocoder: any;
@Component({
  selector: 'app-shop-map',
  templateUrl: './shop-map.component.html',
  styleUrl: './shop-map.component.scss'
})
export class ShopMapComponent {
  private map: any;
  role: any;
  markers: any[] = [];
  destination: any;
  origin: any;
  destination_lng!: number;
  destination_lat!: number;
  origin_lng!: number;
  origin_lat!: number;
  shopName: any;
  customerName: any;
  i = 0;
  TOTAL_STEP = 4;
  shortestDistance = 0;
  fastestTime = 0;
  visible = false;
  proposal: any
  proposalId: any;
  private isDialogShown = false;

  constructor(private othersService: OthersService, private activatedRoute: ActivatedRoute, private proposalService: ProposalService, 
    private router: Router, private notificationService: NotificationService, private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.role = await this.getRole();
    [this.proposalId, this.origin, this.destination] =
      await this.init();
    this.notificationService.connect(this.proposalId);

    goongjs.accessToken = environment.mapKey;
    this.map = new goongjs.Map({
      container: 'map',
      zoom: 12,
      style: 'https://tiles.goong.io/assets/goong_map_web.json',
    });

    [this.destination_lng, this.destination_lat] = await this.convertToLatLng(
      this.destination
    );
    [this.origin_lng, this.origin_lat] = await this.convertToLatLng(this.origin);

    this.addMarker(this.destination_lng, this.destination_lat, 'CUSTOMER');
    this.addMarker(this.origin_lng, this.origin_lat, 'SHOP');
    this.setMapCenter();
    [this.fastestTime, this.shortestDistance] = await this.getDistanceAndTime();
    this.getDirectionLines(String(this.i));
    this.startShopSimulation();
    
    
  }

  async init(): Promise<[number, string, string]> {
    return new Promise((resolve, reject) => {
      this.activatedRoute.paramMap.subscribe((params) => {
        const proposalId = Number(params.get('proposalId'));
        this.proposalService.getById(proposalId).subscribe({
          next: (data) => {
            const origin = data.shop.address;
            const destination = data.emergencyRequest.location;
            resolve([proposalId, origin, destination]);
          },
          error: (error) => {
            console.error(error);
            reject(error);
          },
        });
      });
    });
  }

  async getRole(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          console.log(user.roles[0])
          resolve(user.roles[0].name); // Lấy vai trò đầu tiên
        },
        error: (error) => {
          console.error('Error fetching user role:', error);
          reject(error);
        },
      });
    });
  }
  
  setMapCenter(): void {
    const center_lat = (this.origin_lat + this.destination_lat) / 2;
    const center_lng = (this.origin_lng + this.destination_lng) / 2;
    this.map.setCenter([center_lng, center_lat]);
  }

  addMarker(lng: number, lat: number, role: string): void {
    const marker = new goongjs.Marker({
      color: role === 'SHOP' ? '#FF5733' : '#33C1FF', // Màu khác biệt
  })
    .setLngLat([lng, lat])
    .addTo(this.map);

  marker['role'] = role;

  this.markers.push(marker);
  }

  startShopSimulation(): void {
  const intervalId = setInterval(() => {
    this.origin_lat += (this.destination_lat - this.origin_lat) / this.TOTAL_STEP;
    this.origin_lng += (this.destination_lng - this.origin_lng) / this.TOTAL_STEP;
    this.updateShopMarker();
    this.sendUpdatedPositionToCustomer(this.origin_lat, this.origin_lng);
    

    if (this.checkIfArrived() && !this.isDialogShown) {
      clearInterval(intervalId);
      this.isDialogShown = true;
      Swal.fire({
        title: 'Đã đến nơi!',
        text: 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!',
        icon: 'success',
        confirmButtonText: 'Hoàn tất',
      }).then((res) => {
        
        if (res.isConfirmed) {
          this.router.navigate(['/shop-home']);
        }
      });
    }
  }, 10000);
}

  

  updateShopMarker(): void {
    const shopMarker = this.markers.find(
      (marker) => marker['role'] === 'SHOP'
    );
    if (shopMarker) {
      shopMarker.setLngLat([this.origin_lng, this.origin_lat]);
    } else {
      this.addMarker(this.origin_lng, this.origin_lat, 'SHOP');
    }
    // this.markers.pop()!.remove();
    this.map.removeLayer(String(this.i));
    this.map.removeSource(String(this.i++));
    this.getDirectionLines(String(this.i));
  }

  sendUpdatedPositionToCustomer(lat: number, lng: number): void {
    const message = `LIVE_TRACKING_SHOP ${lat},${lng}`;
    this.notificationService.sendLocation(this.proposalId.toString(), message);
    console.log(message);
  }


  checkIfArrived(lat: number = this.origin_lat, lng: number = this.origin_lng): boolean {
    const distance = this.calculateDistance(
      lat,
      lng,
      this.destination_lat,
      this.destination_lng
    );
    return distance < 0.05;
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.degToRad(lat2 - lat1);
    const dLng = this.degToRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) *
        Math.cos(this.degToRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async convertToLatLng(address: string): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      this.othersService.getLatLng(address).subscribe({
        next: (data: any) => {
          const lat = Number(data.results[0].geometry.location.lat);
          const lng = Number(data.results[0].geometry.location.lng);
          resolve([lng, lat]);
        },
        error: (err: any) => {
          console.error(err);
          reject(err);
        },
      });
    });
  }

  setVisible(){
    this.visible = !this.visible;
  }

  async getDistanceAndTime(): Promise<[number, number]>{
    return new Promise((resolve, reject) =>{
      const origins = `${this.origin_lat},${this.origin_lng}`;
      const destinations = `${this.destination_lat},${this.destination_lng}`;
      console.log(origins);
      this.othersService.getDistanceAndTime(origins, destinations).subscribe({
        next: (data : any) =>{
          const fastestTime = data.rows[0].elements[0].duration.text;
          const shortestDistance = data.rows[0].elements[0].distance.text;
          resolve([fastestTime, shortestDistance])
        }, 
        error: (error) => {
          console.error(error);
          reject(error);
        }
      })
    })
  }

   resetCenter(){
    this.setMapCenter();
  }
  goBack(){
    this.router.navigate([''])
  }

  getDirectionLines(id: string): void {
        const origin = this.origin_lat + ',' + this.origin_lng;
        const destination = this.destination_lat + ',' + this.destination_lng;
    
        console.log('Fetching directions from:', origin, 'to:', destination);
    
        this.othersService.getDirections(origin, destination).subscribe({
          next: (response) => {
            const route = response.routes[0];
            console.log('Route details:', route);
    
            const geometryString = route.overview_polyline?.points;
    
            let coordinates = polyline
              .decode(geometryString)
              .map((coord: number[]) => [coord[1], coord[0]]);
            coordinates = coordinates.filter(
              ([lng, lat]) => !isNaN(lng) && !isNaN(lat)
            );
            console.log('Filtered coordinates:', coordinates);
    
            this.map.addSource(id, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: coordinates,
                },
              },
            });
    
            this.map.addLayer({
              id: id,
              type: 'line',
              source: id,
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#1fe80d',
                'line-width': 6,
              },
            });
          },
          error: (err) => {
            console.error('Error fetching directions:', err);
          },
        });
      }
    }
    