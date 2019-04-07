import { Component, OnInit } from "@angular/core";
import { DeviceService } from "../../services/device.service";
import { User } from "../../models/user";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-sync-device",
  templateUrl: "./sync-device.component.html",
  styleUrls: ["./sync-device.component.scss"]
})
export class SyncDeviceComponent implements OnInit {
  patient: User;
  constructor(private deviceService: DeviceService, private modalCtrl: ModalController) {}

  ngOnInit() {}

  onClose() {
    this.modalCtrl.dismiss();
  }

  onSync(ip: string) {
    // this.patient.DeviceIp=ip;
    // if (ip) this.deviceService.sync(this.patient);
    this.modalCtrl.dismiss(ip);
  }
}
