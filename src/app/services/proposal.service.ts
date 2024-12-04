import { HttpClient } from '@angular/common/http';
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

}
