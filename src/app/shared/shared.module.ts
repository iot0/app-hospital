import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DeviceConnectComponent } from "./components/device-connect/device-connect.component";
import { DrawerComponent } from "./components/drawer/drawer.component";
import { LocationModule } from "./components/location/location.module";
import { IonicModule } from "@ionic/angular";
import { SelectDoctorComponent } from "./components/select-doctor/select-doctor.component";
import { RibbonDirective } from "./directives/ribbon.directive";
import { SyncDeviceComponent } from "./components/sync-device/sync-device.component";
import { CreateNotificationComponent } from "./components/create-notification/create-notification.component";
import { ViewNotificationComponent } from "./components/view-notification/view-notification.component";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DeviceThresholdComponent } from "./components/device-threshold/device-threshold.component";

@NgModule({
  declarations: [
    DeviceThresholdComponent,
    DrawerComponent,
    DeviceConnectComponent,
    SelectDoctorComponent,
    RibbonDirective,
    SyncDeviceComponent,
    CreateNotificationComponent,
    ViewNotificationComponent
  ],
  imports: [CommonModule, CommonModule, LocationModule, IonicModule, ReactiveFormsModule, RouterModule],
  exports: [
    DeviceThresholdComponent,
    LocationModule,
    DrawerComponent,
    DeviceConnectComponent,
    SelectDoctorComponent,
    RibbonDirective,
    SyncDeviceComponent,
    CreateNotificationComponent,
    ViewNotificationComponent
  ],
  entryComponents: [
    DeviceThresholdComponent,
    SelectDoctorComponent,
    SyncDeviceComponent,
    CreateNotificationComponent,
    ViewNotificationComponent
  ]
})
export class SharedModule {}
