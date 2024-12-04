import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class Util{
    convertDate(date: NgbDateStruct): string{
        return date.year + "-" + (date.month < 10 ? ('0' + date.month) : date.month)
        + "-" + (date.day < 10 ? ('0' + date.day) : date.day)
    }
}
