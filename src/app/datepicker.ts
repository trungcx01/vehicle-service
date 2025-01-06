import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  // Phương thức này chuyển đổi chuỗi thành đối tượng NgbDateStruct
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.split('/');
      return { day: parseInt(dateParts[0], 10), month: parseInt(dateParts[1], 10), year: parseInt(dateParts[2], 10) };
    }
    return null;
  }

  // Phương thức này định dạng đối tượng NgbDateStruct thành chuỗi ngày tháng
  format(date: NgbDateStruct | null): string {
    if (date) {
      const day = date.day < 10 ? '0' + date.day : date.day;
      const month = date.month < 10 ? '0' + date.month : date.month;
      return `${day}/${month}/${date.year}`;
    }
    return '';
  }  
}
