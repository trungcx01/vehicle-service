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
    return date ? `${date.day}/${date.month}/${date.year}` : '';
  }
}
