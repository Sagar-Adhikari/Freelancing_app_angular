import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './base.component';
import { routing } from './../../../data/routing';

const routes: Routes = routing.frontend;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BaseRoutingModule {

}
