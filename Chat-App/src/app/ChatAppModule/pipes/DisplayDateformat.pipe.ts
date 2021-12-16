import { Pipe, PipeTransform } from '@angular/core';
// import * as moment from 'moment';
import * as moment from 'moment-timezone';


@Pipe({
  name: 'DisplaydateTimeFormat',
  pure: false,
})
export class DisplayDateTimeFormatPipe implements PipeTransform {
 
  transform(date: string, format: string = 'HH:mm DD/MM/YYYY '): string {
    var tz =moment.tz.guess()
   
     let d=date+'Z'
     var dec = moment(d);
     return  dec.tz(tz).format(' HH:mm DD/MM/YYYY');
    // return moment(d).format("HH:mm  ");
  }
}