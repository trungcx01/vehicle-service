import { NotificationService } from '../../../services/notification.service';
import { ProposalService } from '../../../services/proposal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { OthersService } from '../../../services/others.service';
import polyline from '@mapbox/polyline';
import { Toast } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

declare var goongjs: any;
declare var GoongGeocoder: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
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
  i = 100;
  TOTAL_STEP = 4;
  shortestDistance = 0;
  fastestTime = 0;
  visible = true;
  proposal: any;
  proposalId: any;

  constructor(
    private othersService: OthersService,
    private activatedRoute: ActivatedRoute,
    private proposalService: ProposalService,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.role = await this.getRole();
    [this.proposalId, this.origin, this.destination] = await this.init();
    // subcribe channel để nhận vik trí
    this.notificationService.connect(this.proposalId);
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        if (data.startsWith('LIVE_TRACKING_SHOP')) {
          this.updateShopPosition(data);
        }
      },
      error: (error) => {
        console.error('Notification error:', error);
      },
    });

    goongjs.accessToken = environment.mapKey;
    this.map = new goongjs.Map({
      container: 'map',
      zoom: 12,
      style: 'https://tiles.goong.io/assets/goong_map_web.json',
    });

    [this.destination_lng, this.destination_lat] = await this.convertToLatLng(
      this.destination
    );
    try {
      const origin_lat_lng = await this.getShopLastLocation(this.proposalId);
      console.log(origin_lat_lng + '  oie3098092');

      if (origin_lat_lng !== 'Cửa hàng chưa di chuyển!' && origin_lat_lng) {
        const split = origin_lat_lng.split(',');
        this.origin_lat = parseFloat(split[0]);
        this.origin_lng = parseFloat(split[1]);
      } else {
        [this.origin_lng, this.origin_lat] = await this.convertToLatLng(
          this.origin
        );
      }
    } catch (error) {
      console.error('Error fetching last location:', error);
      [this.origin_lng, this.origin_lat] = await this.convertToLatLng(
        this.origin
      );
    }

    this.addMarker(this.destination_lng, this.destination_lat, 'CUSTOMER');
    this.addMarker(this.origin_lng, this.origin_lat, 'SHOP');
    this.setMapCenter();
    [this.fastestTime, this.shortestDistance] = await this.getDistanceAndTime();
    this.getDirectionLines(String(this.i));
  }

  async getShopLastLocation(proposalId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.proposalService.getShopLastLocation(proposalId).subscribe({
        next: (res) => {
          console.log(res);
          resolve(res.message);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  async init(): Promise<[number, string, string]> {
    return new Promise((resolve, reject) => {
      this.activatedRoute.paramMap.subscribe((params) => {
        const proposalId = Number(params.get('proposalId'));
        console.log('hdhe', proposalId);
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
          console.log(user.roles[0]);
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

    const bounds = [
      [this.origin_lng, this.origin_lat],
      [this.destination_lng, this.destination_lat],
    ];
    this.map.fitBounds(bounds, {
      padding: 20,
      maxZoom: 15,
    });
  }

  addMarker(lng: number, lat: number, role: string): void {
    const marker = new goongjs.Marker({
      color: role === 'SHOP' ? '#FF5733' : '#33C1FF',
    })
      .setLngLat([lng, lat])
      .addTo(this.map);

    const element = marker.getElement();
    element.setAttribute('data-role', role);

    this.markers.push(marker);
  }

  updateShopPosition(data: string): void {
    console.log('dc', this.markers);
    const [lat, lng] = data.split(' ')[1].split(',').map(Number);
    [this.origin_lat, this.origin_lng] = [lat, lng];

    const shopMarker = this.markers.find(
      (marker) => marker.getElement().getAttribute('data-role') === 'SHOP'
    );

    if (shopMarker) {
      console.log('iheoewjdi ');
      shopMarker.setLngLat([lng, lat]);
    } else {
      this.addMarker(lng, lat, 'SHOP');
    }

    if (this.role === 'CUSTOMER' && this.checkIfArrived(lat, lng)) {
      Swal.fire({
        title: 'Cửa hàng đã đến!',
        text: 'Cảm ơn bạn đã sử dụng dịch vụ!',
        icon: 'info',
        confirmButtonText: 'OK',
      }).then((res) => {
        if (res.isConfirmed) {
          this.router.navigate(['']);
        }
      });
    }

    this.map.removeLayer(String(this.i));
    this.map.removeSource(String(this.i++));
    this.getDirectionLines(String(this.i));
  }

  checkIfArrived(
    lat: number = this.origin_lat,
    lng: number = this.origin_lng
  ): boolean {
    const distance = this.calculateDistance(
      lat,
      lng,
      this.destination_lat,
      this.destination_lng
    );
    return distance < 0.05; // 50 m
  }

  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
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

  setVisible() {
    this.visible = !this.visible;
  }

  async getDistanceAndTime(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      const origins = `${this.origin_lat},${this.origin_lng}`;
      const destinations = `${this.destination_lat},${this.destination_lng}`;
      console.log(origins);
      this.othersService.getDistanceAndTime(origins, destinations).subscribe({
        next: (data: any) => {
          const fastestTime = data.rows[0].elements[0].duration.text;
          const shortestDistance = data.rows[0].elements[0].distance.text;
          // console.log(fastestTime, shortestDistance);
          resolve([fastestTime, shortestDistance]);
        },
        error: (error) => {
          console.error(error);
          reject(error);
        },
      });
    });
  }

  resetCenter() {
    this.setMapCenter();
  }
  goBack() {
    this.router.navigate(['']);
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

