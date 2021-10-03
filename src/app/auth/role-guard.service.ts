import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/sync/user.service';

@Injectable()
export class RoleGuardService implements CanActivate {

    constructor(
        public auth: AuthService,
        public router: Router,
        private syncVar: UserService
    ) {}
    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data.expectedRole;
        const userType = localStorage.getItem('user_type');
        if ( userType !== expectedRole ) {
            this.syncVar.sendMessage('Access Denied');
            this.router.navigate(['/']);
            return false;
        }
        return true;
  }
}
