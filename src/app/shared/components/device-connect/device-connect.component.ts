import { Component, OnInit, Input } from "@angular/core";
import { DrawerComponent } from "../drawer/drawer.component";
import { catchError, share } from "rxjs/operators";
import { of, BehaviorSubject } from "rxjs";
import { DeviceService } from "../../services/device.service";
import { ThemeService } from "../../services/theme.service";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-device-connect",
  templateUrl: "./device-connect.component.html",
  styleUrls: ["./device-connect.component.scss"]
})
export class DeviceConnectComponent implements OnInit {
  device$: BehaviorSubject<any> = new BehaviorSubject(null);

  @Input("drawer")
  drawer: DrawerComponent;
  isOpened: boolean;
  constructor(private deviceService: DeviceService, private themeService: ThemeService, private userService: UserService) {}

  ngOnInit() {
    if (this.drawer) {
      this.drawer.onChange.subscribe(change => {
        this.onDrawerStateChange(change);
      });
    }

    this.userService.getWatchingDevices().subscribe(devices => {
      console.log(devices);
      devices.forEach(x => {
        this.deviceService.sync(x);
      });
      this.deviceService.onDeviceStatus().subscribe(res => {
        let devices = this.device$.value;
        if (devices) {
          devices.forEach(device => {
            if (res[device.DeviceIp]) {
              device.Status = res[device.DeviceIp];
            }
          });
        }
        this.device$.next(devices);
      });
    });
  }

  getStatuses() {
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
}
