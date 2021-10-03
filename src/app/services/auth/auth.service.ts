import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { environment } from './../../../environments/environment';
@Injectable()

export class AuthService {

  constructor(private apiService: ApiService) { }

  get isLogged() {
     if(this.apiService.decodejwts().userid) {
        return true;
     } else {
        return false;
     }
  }

  get isAdmin() {
    if (this.apiService.decodejwts().userid) {
       if (this.apiService.decodejwts().email == environment.adminEmail) {
          return true;
       }
    }
     return false;
    }

}
