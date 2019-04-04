import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MatCommonModule} from '@angular/material';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
