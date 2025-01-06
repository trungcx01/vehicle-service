import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProposalDTO } from '../models/proposal.model';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  apiUrl = 'http://localhost:8080/api/proposals'

  constructor(private http: HttpClient) { }

  getListProposals(erId: number): Observable<any> {
    return this.http.get(this.apiUrl + "/emergency-request-" + erId);
  }

  createProposal(proposal: IProposalDTO): Observable<any>{
    return this.http.post(this.apiUrl, proposal);
  }

  acceptProposal(id: number): Observable<any>{
    return this.http.put(this.apiUrl + "/" + id, {});
  }

  getById(id: number): Observable<any>{
    return this.http.get(this.apiUrl + "/" + id);
  }

  updateStatus( status: string, id: number): Observable<any> {
    const params = new HttpParams().set('status', status);  
    return this.http.put(this.apiUrl + "/update-status/" + id, {}, { params });
  }

  getShopLastLocation(proposalId: any): Observable<any>{
    return this.http.get("http://localhost:8080/api/get-shop-last-location/" + proposalId);
  }
}
