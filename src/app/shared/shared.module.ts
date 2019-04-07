import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceConnectComponent } from './components/device-connect/device-connect.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { LocationModule } from './components/location/location.module';
import { IonicModule } from '@ionic/angular';
import { SelectDoctorComponent } from './components/select-doctor/select-doctor.component';
import { RibbonDirective } from './directives/ribbon.directive';
import { SyncDeviceComponent } from './components/sync-device/sync-device.component';

@NgModule({
  declarations: [DrawerComponent,DeviceConnectComponent,SelectDoctorComponent, RibbonDirective,SyncDeviceComponent],
  imports: [
    CommonModule,
    CommonModule,
    LocationModule,
    IonicModule
  ],
  exports:[LocationModule,DrawerComponent,DeviceConnectComponent,SelectDoctorComponent,RibbonDirective,SyncDeviceComponent],
  entryComponents:[SelectDoctorComponent,SyncDeviceComponent]
})
export class SharedModule { }
