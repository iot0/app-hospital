import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { timer, BehaviorSubject, Observable } from "rxjs";
import { switchMap, share } from "rxjs/operators";
import { User } from "../models/user";

@Injectable({
  providedIn: "root"
})
export class DeviceService {
  deviceStatus$: BehaviorSubject<any> = new BehaviorSubject(null);

  deviceWatchList = {};
  constructor(private http: HttpClient) {}

  sync(patient: User) {
    if (!this.deviceWatchList[patient.DeviceIp]) {
      this.deviceWatchList[patient.DeviceIp] = patient;
      this.startTimer(patient.DeviceIp);
    }
    return;
  }

  setDeviceStatus(status) {
    this.deviceStatus$.next(status);
  }

  onDeviceStatus(): Observable<any> {
    return this.deviceStatus$.pipe(share());
  }

  startTimer(ip: string) {
    timer(0, 2000)
      .pipe(
        switchMap(x => {
          return this.http.get(`http://${ip}/status`);
        }),
        share()
      )
      .subscribe(status => {
        this.deviceWatchList[ip] = status;
        this.setDeviceStatus(this.deviceWatchList);
      });
  }
}
