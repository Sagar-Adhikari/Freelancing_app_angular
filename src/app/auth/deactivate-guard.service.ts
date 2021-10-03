import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class DeactivateGuardService implements  CanDeactivate<CanComponentDeactivate>{
  live_count:number=0;
  constructor(
    private apiService: ApiService,
    private router:Router
    ){

  }
  canDeactivate(component: CanComponentDeactivate) {

  	// this.live_count = parseInt(localStorage.getItem('live_broadcasts'));
   //  if(this.live_count!=0 && this.apiService.decodejwts()!=false && this.apiService.decodejwts().userid){
   //  	this.router.navigate(['/broadcast/view/'+this.live_count]);
   //  	return true;
   //  }else{
   //  	return true;
   //  }
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}