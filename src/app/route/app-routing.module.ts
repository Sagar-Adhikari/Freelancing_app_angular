import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
  
const routes: Routes = [
  {
    path: '',
    loadChildren: '../templates/base/base.module#BaseModule',
    data: {
        title: "Home",
        layout:"layout1",
        meta: {
        description: "live streaming software",
        "og:image": "http://localhost:4200/assets/images/logo.png"
      }
    } 
  },
  {
    path: 'admin',
    loadChildren: '../admin/admin.module#AdminModule',
    data: {
        title: "Dashboard",
        layout:"layout4",
        meta: {
        description: "live streaming software",
        "og:image": "http://localhost:4200/assets/images/logo.png"
      }
    } 
  },
   {
    path: '**',
    redirectTo: '/404',
    data: {
        title: "Home",
        layout:"layout1",
        meta: {
        description: "live streaming software",
        "og:image": "http://localhost:4200/assets/images/logo.png"
      }
    } 
  }
     
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})


export class AppRoutingModule {

  titlePrefix:any;
  production:boolean;
}
