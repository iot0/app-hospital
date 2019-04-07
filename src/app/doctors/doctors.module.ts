import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DoctorsPage } from './doctors.page';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';

const routes: Routes = [
  {
    path: '',
    component: DoctorsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [DoctorsPage,DoctorFormComponent],
  entryComponents:[DoctorFormComponent]
})
export class DoctorsPageModule {}
