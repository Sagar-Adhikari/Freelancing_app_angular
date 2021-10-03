import { Injectable } from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})

// export class MyErrorHandler {

//   constructor() { }
// }

export class ErrorService implements ErrorHandler {
  constructor() {}
  handleError(error: Error) {
    var description = '';
   if (Error instanceof HttpErrorResponse) {
    description = (error as HttpErrorResponse).message + ' ' + (error as HttpErrorResponse).error;
   } else {
    description = error.stack;
   }
    if(environment.production == false){
      console.error(error);
    } else {
      (<any>window).ga('send', 'exception', {
        'exDescription': description,
        'exFatal': false
      });
    }
   }
}