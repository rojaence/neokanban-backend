import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class DateService {
  private parse(date: Date) {
    return DateTime.fromJSDate(date);
  }

  getNow(zone = 'UTC') {
    return DateTime.now().setZone(zone).toJSDate();
  }

  addMinutes(date: Date, minutes: number) {
    return this.parse(date).plus({ minutes }).toJSDate();
  }

  toString(
    date: Date,
    format: Intl.DateTimeFormatOptions = DateTime.DATETIME_MED,
  ) {
    return this.parse(date).toLocaleString(format);
  }
}
