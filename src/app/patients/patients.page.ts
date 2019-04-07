import { Component, OnInit, OnDestroy } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserService } from "../shared/services/user.service";
import { UserRole } from "../shared/models/user";
import { catchError, takeWhile } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { ThemeService } from "../shared/services/theme.service";

@Component({
  selector: "app-patients",
  templateUrl: "./patients.page.html",
  styleUrls: ["./patients.page.scss"]
})
export class PatientsPage implements OnInit, OnDestroy {
  data$: BehaviorSubject<any> = new BehaviorSubject({ loading: true });
  isAlive: boolean = true;
  constructor(private userService: UserService, private route: ActivatedRoute, private themeService: ThemeService) {
    this.route.params.subscribe(param => {
      console.log(param);
      // loading  details
      this.loadDetails(param.id);
    });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  loadDetails(doctorId?: string) {
    let service;
    if (doctorId && doctorId != "") {
      service = this.userService.getDoctorPatients(doctorId);
    } else {
      service = this.userService.getByRole(UserRole.Patient);
    }

    service
      .pipe(
        catchError(err => {
          this.data$.next({ error: true });
          return err;
        }),
        takeWhile(() => this.isAlive)
      )
      .subscribe(res => {
        console.log(res);
        if (res) this.data$.next({ data: res });
        else this.data$.next({ empty: true });
      });
  }
}
