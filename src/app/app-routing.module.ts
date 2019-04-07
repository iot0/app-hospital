import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./shared/guards/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "welcome", pathMatch: "full" },
  { path: "home", loadChildren: "./home/home.module#HomePageModule", canActivate: [AuthGuard], canLoad: [AuthGuard] },
  { path: "login", loadChildren: "./login/login.module#LoginPageModule", canActivate: [AuthGuard], canLoad: [AuthGuard] },
  { path: "register", loadChildren: "./register/register.module#RegisterPageModule" },
  { path: "welcome", loadChildren: "./welcome/welcome.module#WelcomePageModule" },
  { path: "doctors", loadChildren: "./doctors/doctors.module#DoctorsPageModule" },
  { path: "patients",  redirectTo: "patients/" },
  { path: "patients/:id", loadChildren: "./patients/patients.module#PatientsPageModule" },
  { path: "patient", redirectTo: "patient/" },
  { path: "patient/:id", loadChildren: "./patient/patient.module#PatientPageModule" },
  { path: "doctor", redirectTo: "doctor/" },
  { path: "doctor/:id", loadChildren: "./doctor/doctor.module#DoctorPageModule" },
  { path: 'notification', loadChildren: './notification/notification.module#NotificationPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
