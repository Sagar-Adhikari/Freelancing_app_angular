import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/sync/user.service';

@Injectable()
export class UserGuard implements CanActivate {

    constructor(
    private auth: AuthService,
    private router: Router,
    private syncVar: UserService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.auth.isLogged) {
      this.router.navigate(['/login']);
      this.syncVar.sendMessage('Access Denied');
      return false;
    }
    return true;
  }
}
