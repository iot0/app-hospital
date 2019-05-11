import { Component, OnInit, OnDestroy } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ModalController } from "@ionic/angular";
import { UserService } from "../../services/user.service";
import { UserRole, User } from "../../models/user";
import { catchError, takeWhile } from "rxjs/operators";

@Component({
  selector: "app-select-doctor",
  templateUrl: "./select-doctor.component.html",
  styleUrls: ["./select-doctor.component.scss"]
})
export class SelectDoctorComponent implements OnDestroy {
  data$: BehaviorSubject<any> = new BehaviorSubject({ loading: true });
  isAlive: boolean = true;
  constructor(public modalController: ModalController, private userService: UserService) {
    this.userService
      .getHospitalDoctors()
      .pipe(
        catchError(err => {
          this.data$.next({ error: true });
          return err;
        }),
        takeWhile(() => this.isAlive)
      )
      .subscribe(res => {
        if (res && res.length > 0) this.data$.next({ data: res });
        else this.data$.next({ empty: true });
        console.log(res);
      });
  }

  onClose() {
    this.modalController.dismiss();
  }
  onSelect(doctor: User) {
    this.modalController.dismiss(doctor);
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
