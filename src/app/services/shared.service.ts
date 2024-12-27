import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private role : string = 'ANONYMOUS';

  getRole(){
    return this.role;
  }

  setRole(role: string){
    this.role = role;
  }
}
