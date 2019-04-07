import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserService } from "../shared/services/user.service";
import { ActivatedRoute } from "@angular/router";
import { catchError } from "rxjs/operators";

@Component({
  selector: "app-doctor",
  templateUrl: "./doctor.page.html",
  styleUrls: ["./doctor.page.scss"]
})
export class DoctorPage implements OnInit {
  data$: BehaviorSubject<any> = new BehaviorSubject({ loading: true });
  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.route.params.subscribe(param => {
      console.log(param);
      if (param.id) {
        // loading patient details
        this.loadDoctorDetails(param.id);
      }
    });
  }

  loadDoctorDetails(patientId: string) {
    this.userService
      .getUserDetails(patientId)
      .pipe(
        catchError(err => {
          this.data$.next({ error: true });
          return err;
        })
      )
      .subscribe(res => {
        console.log(res);
        if (res) this.data$.next({ data: res });
        else this.data$.next({ empty: true });
      });
  }
}
