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
  proposal: any
  proposalId: any;

  constructor(private othersService: OthersService, private activatedRoute: ActivatedRoute, private proposalService: ProposalService, 
    private router: Router, private notificationService: NotificationService, private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.role = await this.getRole();
    [this.proposalId, this.origin, this.destination] =
      await this.init();
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
    [this.origin_lng, this.origin_lat] = await this.convertToLatLng(this.origin);

    this.addMarker(this.destination_lng, this.destination_lat, 'customer');
    this.addMarker(this.origin_lng, this.origin_lat, 'shop');
    this.setMapCenter();
    [this.fastestTime, this.shortestDistance] = await this.getDistanceAndTime();
    this.getDirectionLines(String(this.i));
  }

  async init(): Promise<[number, string, string]> {
    return new Promise((resolve, reject) => {
      this.activatedRoute.paramMap.subscribe((params) => {
        const proposalId = Number(params.get('proposalId'));
        this.proposalService.getById(proposalId).subscribe({
          next: (data) => {
            const origin = data.shop.address;
            const destination = data.emergencyRequest.customer.address;
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
    const customMarker = document.createElement('div');
    customMarker.className = role === 'shop' ? 'shop-marker' : 'customer-marker';
    customMarker.style.backgroundImage =
      role === 'shop'
        ? 'url(https://res.cloudinary.com/dmwkcepna/image/upload/v1732774699/shop_marker.png)'
        : 'url(https://res.cloudinary.com/dmwkcepna/image/upload/v1732774699/customer_marker.png)';
    customMarker.style.backgroundSize = 'cover';
    customMarker.style.width = '40px';
    customMarker.style.height = '40px';
    customMarker.style.cursor = 'pointer';

    const marker = new goongjs.Marker({
      element: customMarker,
    })
      .setLngLat([lng, lat])
      .addTo(this.map);
    this.markers.push(marker);
  }

  // startShopSimulation(): void {
  //   const intervalId = setInterval(() => {
  //     this.origin_lat += (this.destination_lat - this.origin_lat) / this.TOTAL_STEP;
  //     this.origin_lng += (this.destination_lng - this.origin_lng) / this.TOTAL_STEP;

  //     this.updateShopMarker();
  //     this.sendUpdatedPositionToCustomer(this.origin_lat, this.origin_lng);

  //     if (this.checkIfArrived()) {
  //       Swal.fire({
  //         title: 'Đã đến nơi!',
  //         text: 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!',
  //         icon: 'success',
  //         confirmButtonText: 'Hoàn tất',
  //       });
  //       clearInterval(intervalId);
  //     }
  //   }, 5000);
  // }

  

  // updateShopMarker(): void {
  //   const shopMarker = this.markers.find(
  //     (marker) => marker.getElement().className === 'shop-marker'
  //   );
  //   if (shopMarker) {
  //     shopMarker.setLngLat([this.origin_lng, this.origin_lat]);
  //   } else {
  //     this.addMarker(this.origin_lng, this.origin_lat, 'shop');
  //   }
  //   this.markers.pop()!.remove();
  //   this.map.removeLayer(String(this.i));
  //   this.map.removeSource(String(this.i));
  //   this.getDirectionLines(String(this.i));
  // }

  // sendUpdatedPositionToCustomer(lat: number, lng: number): void {
  //   const message = `LIVE_TRACKING_SHOP ${lat},${lng}`;
  //   this.notificationService.sendLocation(this.proposalId.toString(), message);
  //   console.log(message);
  // }

  updateShopPosition(data: string): void {
    console.log('dcmdiejde')
    const [lat, lng] = data.split(' ')[1].split(',').map(Number);
    [this.origin_lat, this.origin_lng] = [lat, lng];
    const shopMarker = this.markers.find(
      (marker) => marker.getElement().className === 'shop-marker'
    );
    if (shopMarker) {
      shopMarker.setLngLat([lng, lat]);
    } else {
      this.addMarker(lng, lat, 'shop');
    }

    if (this.role === 'CUSTOMER' && this.checkIfArrived(lat, lng)) {
      Swal.fire({
        title: 'Cửa hàng đã đến!',
        text: 'Cảm ơn bạn đã sử dụng dịch vụ!',
        icon: 'info',
        confirmButtonText: 'OK',
      });
    }
    this.markers.pop()!.remove();
        this.map.removeLayer(String(this.i));
        this.map.removeSource(String(this.i++));
    this.getDirectionLines(String(this.i));
  }

  checkIfArrived(lat: number = this.origin_lat, lng: number = this.origin_lng): boolean {
    const distance = this.calculateDistance(
      lat,
      lng,
      this.destination_lat,
      this.destination_lng
    );
    return distance < 0.05; // 50 meters threshold
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
          // console.log(fastestTime, shortestDistance);
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
    


//   async ngOnInit(): Promise<void> {
//     [this.proposalId, this.origin, this.destination] = await this.init();
//     this.notificationService.connectLocation(this.proposalId);
//     this.notificationService.getNotifications().subscribe({
//       next: (data) => {
//         if (data.startsWith('LIVE_TRACKING_SHOP')){
//           this.updateShopPosition(data);
//         }
//       },
//       error: (error) => {
//       }
//     })
//     goongjs.accessToken = environment.mapKey;
//     this.map = new goongjs.Map({
//       container: 'map',
//       zoom: 12,
//       style: 'https://tiles.goong.io/assets/goong_map_web.json',
//     });

//     [this.destination_lng, this.destination_lat] = await this.convertToLatLng(
//       this.destination
//     );
//     [this.origin_lng, this.origin_lat] = await this.convertToLatLng(
//       this.origin
//     );
//     [this.fastestTime, this.shortestDistance] = await this.getDistanceAndTime();
//     this.addMarker(this.destination_lng, this.destination_lat, 'customer');
//     this.addMarker(this.origin_lng, this.origin_lat, 'shop');
//     this.setMapCenter();
//     this.getCurrentLocation();
//     this.getDirectionLines(String(this.i));
//     const distanceLngByStep = this.caculateByStep(
//       this.origin_lng,
//       this.destination_lng
//     );
//     const distanceLatByStep = this.caculateByStep(
//       this.origin_lat,
//       this.destination_lat
//     );
//     const intervalId = setInterval(() => {
//       this.updatePosition(distanceLatByStep, distanceLngByStep);

//       // Send the updated shop position to the customer
//       this.sendUpdatedPositionToCustomer(this.origin_lat, this.origin_lng);
//       if (this.i === this.TOTAL_STEP) {
//         Swal.fire({
//           title: "Congratulation!",
//           text: "Cửa hàng đã đến. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!",
//           icon: 'success',
//           showLoaderOnConfirm: true,
//           allowOutsideClick: false, 
//           allowEscapeKey: false,  
//           confirmButtonText: 'Đánh giá cửa hàng',
//           showClass: {
//             popup: 'animate__animated animate__fadeInDown'
//           },
//           hideClass: {
//             popup: 'animate__animated animate__fadeOutUp'
//           },
//         }).then((result) => {
//           if (result.isConfirmed) {
//             window.location.href = "shop-detail/" + this.proposal.shop.id;
//           }
//         });
        
//         clearInterval(intervalId);
//       }
//     }, 6000);
//   }

//   setVisible(){
//     this.visible = !this.visible;
//   }

//   async init(): Promise<[number, string, string]>{
//     return new Promise((resolve, reject) => {
//       this.activatedRoute.paramMap.subscribe(params =>{
//         const proposalId = Number(params.get("proposalId"));
//         console.log(proposalId);
//         this.proposalService.getById(proposalId).subscribe({
//           next: (data) => {
//             console.log('dmfrm', data.shop.address);
//             const origin = data.shop.address;
//             const destination = data.emergencyRequest.customer.address;
//             this.proposal = data;
//             resolve([proposalId, origin, destination])
//           },
//           error: (error) => {
//             console.error(error);
//             reject(error);
//           }
//         })
//       })
//     })
//   }

//   async getDistanceAndTime(): Promise<[number, number]>{
//     return new Promise((resolve, reject) =>{
//       const origins = `${this.origin_lat},${this.origin_lng}`;
//       const destinations = `${this.destination_lat},${this.destination_lng}`;
//       console.log(origins);
//       this.othersService.getDistanceAndTime(origins, destinations).subscribe({
//         next: (data : any) =>{
//           const fastestTime = data.rows[0].elements[0].duration.text;
//           const shortestDistance = data.rows[0].elements[0].distance.text;
//           // console.log(fastestTime, shortestDistance);
//           resolve([fastestTime, shortestDistance])
//         }, 
//         error: (error) => {
//           console.error(error);
//           reject(error);
//         }
//       })
//     })
//   }

//   resetCenter(){
//     this.setMapCenter();
//   }
//   goBack(){
//     this.router.navigate([''])
//   }
//   setMapCenter(): void {
//     const center_lat = (this.origin_lat + this.destination_lat) / 2;
//     const center_lng = (this.origin_lng + this.destination_lng) / 2;
//     this.map.setCenter([center_lng, center_lat]);
//   }
//   sendUpdatedPositionToCustomer(lat: number, lng: number) {
//     const message = `LIVE_TRACKING_SHOP ${lat},${lng}`;
//     this.notificationService.sendLocation(this.proposalId.toString(), message);
//   }

//   // Process shop position update
//   updateShopPosition(data: string) {
//     const [lat, lng] = data.split(' ')[1].split(',').map(Number);
//     this.updateMarkerPosition(lat, lng);
//   }

//   // Update the shop's marker on the map
//   updateMarkerPosition(lat: number, lng: number) {
//     const shopMarker = this.markers.find((marker) => marker.getElement() && marker.getElement().className === 'shop-marker');
//     if (shopMarker) {
//       shopMarker.setLngLat([lng, lat]);
//     } else {
//       this.addMarker(lng, lat, 'shop');
//     }
//   }
//   updatePosition(distanceLatByStep: number, distanceLngByStep: number) {
//     this.origin_lat += distanceLatByStep;
//     this.origin_lng += distanceLngByStep;
//     this.markers.pop()!.remove();
//     this.map.removeLayer(String(this.i));
//     this.map.removeSource(String(this.i));
//     this.addMarker(this.origin_lng, this.origin_lat, 'shop');
//     this.i++;
//     // this.setMapCenter();
//     this.getDirectionLines(String(this.i));
//   }

//   caculateByStep(start: number, end: number): number {
//     return (end - start) / this.TOTAL_STEP;
//   }

//   async getRole(): Promise<any>{
//     return new Promise((resolve, reject) =>{
//       this.authService.getCurrentUser().subscribe({
//         next: (user) => {
//           resolve(user.roles[0]);
//         },
//         error: (error) => {
//           reject(error);
//         }
//       })
//     }) 
//   }

//   // initMarker(locations: any): void {
//   //   locations.forEach((e: any) => {
//   //     const marker = new goongjs.Marker().setLngLat(e.coord).addTo(this.map);
//   //     this.markers.push(marker);
//   //   });
//   // } // thêm marker

//   addMarker(lng: number, lat: number, role: string) {
//     const customMarker = document.createElement('div');
//     customMarker.className = role === 'shop' ? 'shop-marker' : 'custom-marker';
//     customMarker.style.backgroundImage =
//       role === 'shop'
//         ? 'url(https://res.cloudinary.com/dmwkcepna/image/upload/v1732774699/shop_marker.png)'
//         : 'url(https://res.cloudinary.com/dmwkcepna/image/upload/v1732774699/customer_marker.png)';
//     customMarker.style.backgroundSize = 'cover'; // Đảm bảo icon không bị biến dạng
//     customMarker.style.width = '40px'; // Kích thước của marker
//     customMarker.style.height = '40px'; // Kích thước của marker
//     customMarker.style.cursor = 'pointer'; // Để biểu tượng có thể được nhấp
    
//     const marker = new goongjs.Marker({
//       element: customMarker,
//     })
//       .setLngLat([lng, lat])
//       .addTo(this.map);
//     this.markers.push(marker);
//   }


//   getCurrentLocation(): void {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         // this.origin_lat = position.coords.latitude;
//         // this.origin_lng = position.coords.longitude;
//       });
//     }
//   }

//   async convertToLatLng(address: string): Promise<[number, number]> {
//     return new Promise((resolve, reject) => {
//       this.othersService.getLatLng(address).subscribe({
//         next: (data: any) => {
//           const lat = Number(data.results[0].geometry.location.lat);
//           const lng = Number(data.results[0].geometry.location.lng);
//           resolve([lng, lat]);
//         },
//         error: (err: any) => {
//           console.log(err);
//           reject(err);
//         },
//       });
//     });
//   }

//   getDirectionLines(id: string): void {
//     const origin = this.origin_lat + ',' + this.origin_lng;
//     const destination = this.destination_lat + ',' + this.destination_lng;

//     console.log('Fetching directions from:', origin, 'to:', destination);

//     this.othersService.getDirections(origin, destination).subscribe({
//       next: (response) => {
//         const route = response.routes[0];
//         console.log('Route details:', route);

//         const geometryString = route.overview_polyline?.points;

//         let coordinates = polyline
//           .decode(geometryString)
//           .map((coord: number[]) => [coord[1], coord[0]]);
//         coordinates = coordinates.filter(
//           ([lng, lat]) => !isNaN(lng) && !isNaN(lat)
//         );
//         console.log('Filtered coordinates:', coordinates);

//         this.map.addSource(id, {
//           type: 'geojson',
//           data: {
//             type: 'Feature',
//             properties: {},
//             geometry: {
//               type: 'LineString',
//               coordinates: coordinates,
//             },
//           },
//         });

//         this.map.addLayer({
//           id: id,
//           type: 'line',
//           source: id,
//           layout: {
//             'line-join': 'round',
//             'line-cap': 'round',
//           },
//           paint: {
//             'line-color': '#1fe80d',
//             'line-width': 6,
//           },
//         });
//       },
//       error: (err) => {
//         console.error('Error fetching directions:', err);
//       },
//     });
//   }
// }
