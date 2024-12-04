import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OthersService {
  constructor(private http: HttpClient) {}

  getLatLng(address: string): Observable<any> {
    return this.http.get(
      `https://rsapi.goong.io/geocode?address=${encodeURIComponent(
        address
      )}&api_key=${environment.apiKey}`
    );
  }

  getDirections(origin: string, destination: string): Observable<any> {
    return this.http.get(`https://rsapi.goong.io/direction?origin=${origin}
      &destination=${destination}&vehicle=car&api_key=${environment.apiKey}`);
  }

  autocomplete(input: string){
    return this.http.get(`https://rsapi.goong.io/Place/AutoComplete?limit=5&radius=2000&input=${input}&api_key=${environment.apiKey}`)
  }

  getDistanceAndTime(origins: string, destinations: string){
    return this.http.get(`https://rsapi.goong.io/distancematrix?origins=${origins}&destinations=${destinations}&vehicle=car&api_key=${environment.apiKey}`)
  }
}
