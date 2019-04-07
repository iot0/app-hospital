import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PatientPage } from './patient.page';
import { SharedModule } from '../shared/shared.module';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientCardComponent } from './patient-card/patient-card.component';
import { FamilyFormComponent } from './family-form/family-form.component';
import { FamilyCardComponent } from './family-card/family-card.component';

const routes: Routes = [
  {
    path: '',
    component: PatientPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [PatientPage,PatientFormComponent,PatientCardComponent,FamilyFormComponent,FamilyCardComponent],
  entryComponents:[FamilyFormComponent]
})
export class PatientPageModule {}
