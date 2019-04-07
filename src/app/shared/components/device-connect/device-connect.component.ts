import { Component, OnInit, Input } from "@angular/core";
import { DrawerComponent } from "../drawer/drawer.component";
import { catchError, share } from "rxjs/operators";
import { of, BehaviorSubject } from "rxjs";
import { DeviceService } from "../../services/device.service";
import { ThemeService } from "../../services/theme.service";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { ModalController } from "@ionic/angular";
import { DeviceThresholdComponent } from "../device-threshold/device-threshold.component";

@Component({
  selector: "app-device-connect",
  templateUrl: "./device-connect.component.html",
  styleUrls: ["./device-connect.component.scss"]
})
export class DeviceConnectComponent implements OnInit {
  device$: BehaviorSubject<any> = new BehaviorSubject(null);

  defaultThreshold = {
    minTemp: 22,
    maxTemp: 25,
    minHeartRate: 68,
    maxHeartRate: 73,
    minPressure: 85,
    maxPressure: 90
  };
  @Input("drawer")
  drawer: DrawerComponent;
  isOpened: boolean;
  constructor(private deviceService: DeviceService, private userService: UserService, private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.drawer) {
      this.drawer.onChange.subscribe(change => {
        this.onDrawerStateChange(change);
      });
    }
    let user=this.userService.currentUserObj();

    this.userService.getWatchingDevices(user.Uid).subscribe(devices => {
      this.device$.next(devices);
    });
  }

  getDevices() {
    return this.device$.pipe(share());
  }
  //TODO: To show arrow accordingly for customer popup
  onDrawerStateChange(change) {
    switch (change) {
      case "opened":
        this.isOpened = true;
        break;
      case "closed":
        this.isOpened = false;
        break;
    }
  }
  async setThreshold(device) {
    let props = this.defaultThreshold;
    if (device && device.Threshold) props = { ...props, ...device.Threshold };

    const modal = await this.modalCtrl.create({
      component: DeviceThresholdComponent,
      componentProps: { data: props }
    });

    modal.onWillDismiss().then(res => {
      console.log(res);
      device.Threshold = res.data;
    });
    return await modal.present();
  }
  connect(device: any) {
    if (!device.Threshold) device.Threshold = this.defaultThreshold;
    device.Status = "loading...";
    this.deviceService
      .sync(device.DeviceIp, device.Threshold)
      .pipe(
        catchError(err => {
          device.Status = "error";
          return err;
        })
      )
      .subscribe(res => {
        device.Status = "success";
        device.Result = res;
        console.log(res);
      });
  }

  checkTemp(device: any) {
    return "Normal Temparature";
  }
  checkPressure(device: any) {
    return "Normal Prressure";
  }
  checkHeartRate(device: any) {
    return "Normal Heart Rate";
  }
}
