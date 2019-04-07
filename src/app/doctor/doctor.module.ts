import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DoctorPage } from './doctor.page';
import { DoctorCardComponent } from './doctor-card/doctor-card.component';

const routes: Routes = [
  {
    path: '',
    component: DoctorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DoctorPage,DoctorCardComponent]
})
export class DoctorPageModule {}
