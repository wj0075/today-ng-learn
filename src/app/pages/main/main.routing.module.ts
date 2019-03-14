import { NgModule } from '@angular/core';
import {MainComponent} from './main.component';
import {RouterModule, Routes} from '@angular/router';
import {InitGuardService} from '../../services/init-guard/init-guard.service';
const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    canActivate: [InitGuardService]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class MainRoutingModule { }
