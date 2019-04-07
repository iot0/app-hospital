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

  sync(patientIp,threshold) {
    return this.startTimer(patientIp,threshold);
  }

  startTimer(ip: string,threshold:any) {
    debugger;
    return timer(0, 2000)
      .pipe(
        switchMap(x => {
          return this.http.post(`http://${ip}/status`,threshold);
        }),
        share());
  }
}
