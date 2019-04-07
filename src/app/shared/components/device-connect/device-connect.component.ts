import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { DrawerComponent } from "../drawer/drawer.component";
import { catchError, share, takeWhile } from "rxjs/operators";
import { of, BehaviorSubject } from "rxjs";
import { DeviceService } from "../../services/device.service";
import { ThemeService } from "../../services/theme.service";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { ModalController } from "@ionic/angular";
import { DeviceThresholdComponent } from "../device-threshold/device-threshold.component";
import { pipe } from "@angular/core/src/render3";

@Component({
  selector: "app-device-connect",
  templateUrl: "./device-connect.component.html",
  styleUrls: ["./device-connect.component.scss"]
})
export class DeviceConnectComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.isAlive = false;
  }
  data$: BehaviorSubject<any> = new BehaviorSubject({ loading: true });

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
  isAlive: boolean = true;

  constructor(private deviceService: DeviceService, private userService: UserService, private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.drawer) {
      this.drawer.onChange.subscribe(change => {
        this.onDrawerStateChange(change);
      });
    }
    let user = this.userService.currentUserObj();

    this.userService
      .getWatchingDevices(user.Uid)
      .pipe(
        catchError(err => {
          this.data$.next({ error: true });
          return err;
        }),
        takeWhile(() => this.isAlive)
      )
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          res.forEach(device => {
            device.Threshold = this.defaultThreshold;
          });
          this.data$.next({ data: res });
        } else this.data$.next({ empty: true });
      });
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
        }),
        takeWhile(() => this.isAlive)
      )
      .subscribe(res => {
        device.Status = "success";
        device.Result = res;
        console.log(res);
      });
  }

  checkTemp(device: any) {
    if (device.Result && device.Status === "success" && device.Threshold) {
      if (device.Threshold.minTemp < device.Result.temperature && device.Threshold.maxTemp > device.Result.temperature) {
        return `Normal Temparature (${device.Result.temperature})`;
      } else {
        return `Abnormal Temparature (${device.Result.temperature})`;
      }
    }
    return "NA";
  }
  checkPressure(device: any) {
    if (device.Result && device.Status === "success" && device.Threshold) {
      if (device.Threshold.minPressure < device.Result.pressure && device.Threshold.maxPressure > device.Result.pressure) {
        return `Normal Pressure (${device.Result.pressure})`;
      } else {
        return `Abnormal Pressure (${device.Result.pressure})`;
      }
    }
    return "NA";
  }
  checkHeartRate(device: any) {
    if (device.Result && device.Status === "success" && device.Threshold) {
      if (device.Threshold.minHeartRate < device.Result.heartRate && device.Threshold.maxHeartRate > device.Result.heartRate) {
        return `Normal HeartRate (${device.Result.heartRate})`;
      } else {
        return `Abnormal HeartRate (${device.Result.heartRate})`;
      }
    }
    return "NA";
  }
}
