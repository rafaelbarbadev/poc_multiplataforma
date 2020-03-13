import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { isNullOrUndefined } from 'util';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  public transform(value: string, formatDate?: string): any {
    if (isNullOrUndefined(value)) {
      return '';
    }
    return formatDate ? moment(value, 'DD/MM/YYYY hh:mm:ss.SSSSSS')
      .format(formatDate) : moment(value, 'DD/MM/YYYY hh:mm:ss.SSSSSS')
        .format('DD/MM/YYYY');
  }
}
