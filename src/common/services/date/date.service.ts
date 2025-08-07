import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class DateService {
  private parse(date: Date | string) {
    return typeof date === 'string'
      ? DateTime.fromISO(date)
      : DateTime.fromJSDate(date);
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

  isBefore(dateA: Date, dateB: Date): boolean {
    return this.parse(dateA) < this.parse(dateB);
  }
}
