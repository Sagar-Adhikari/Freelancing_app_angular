import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncatetext'
})
export class TruncatetextPipe implements PipeTransform {

  transform(value: any, length?: any): any {
    const biggestWord = 0;
    const elipses = '...';

    if (typeof value === 'undefined') { return value; }
    if (value.length <= length) { return value; }

    // truncate to about correct lenght
    console.log(length);
    const truncatedText = value.slice(0, length + biggestWord);

    return truncatedText + elipses;
  }

}
