import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../sync/user.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private usersService: UserService,
      ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if(error.status == 403 && error.error['detail'] == "token not found"){
            this.clearSession();
          } else if(error.status == 401 && error.error['detail'] == "Signature has expired."){
            this.clearSession();
          }
          return throwError(error);
        })
      )
  }

  clearSession() {
    localStorage.clear();
    this.usersService.userlogin('guest');
    this.router.navigate(['/']);
  }
}