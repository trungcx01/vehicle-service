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
    dateToNgbDateStruct(date: Date): NgbDateStruct {
        return {
          year: date.getFullYear(),
          month: date.getMonth() + 1, 
          day: date.getDate()
        };
      }

      ngbDateStructToDate(date: NgbDateStruct): Date {
        return new Date(date.year, date.month - 1, date.day)
      }
}
