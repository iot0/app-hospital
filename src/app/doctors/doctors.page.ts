import { Component, OnInit, OnDestroy } from "@angular/core";
import { DoctorFormComponent } from "./doctor-form/doctor-form.component";
import { takeWhile, catchError } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { ModalController } from "@ionic/angular";
import { UserService } from "../shared/services/user.service";
import { UserRole } from "../shared/models/user";

@Component({
  selector: "app-doctors",
  templateUrl: "./doctors.page.html",
  styleUrls: ["./doctors.page.scss"]
})
export class DoctorsPage implements OnInit,OnDestroy {
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

  ngOnInit() {}

  async onCreate() {
    const modal = await this.modalController.create({
      component: DoctorFormComponent
    });
    return await modal.present();
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
