import { Component, OnInit } from "@angular/core";
import { FormMode } from "../shared/models/form";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../shared/models/user";
import { UserService } from "../shared/services/user.service";
import { catchError, first, map } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { ModalController } from "@ionic/angular";
import { FamilyFormComponent } from "./family-form/family-form.component";
import { ThemeService } from "../shared/services/theme.service";
import { SyncDeviceComponent } from "../shared/components/sync-device/sync-device.component";

@Component({
  selector: "app-patient",
  templateUrl: "./patient.page.html",
  styleUrls: ["./patient.page.scss"]
})
export class PatientPage implements OnInit {
  mode: FormMode = "existing";
  data$: BehaviorSubject<any> = new BehaviorSubject({ loading: true });
  family$: BehaviorSubject<any> = new BehaviorSubject({ loading: true });
  isAlive: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public userService: UserService,
    public modalController: ModalController,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(param => {
      console.log(param);
      if (param.id && param.id != "undefined") {
        // loading patient details
        this.loadPatientDetails(param.id);
        //loading family details
        this.loadFamilies(param.id);
      } else {
        this.mode = "new";
      }
    });
  }

  afterPatientRegistration(data: User) {
    // console.log(data);
    // this.data$.next({ data: data });
    // this.mode = "existing";
    this.router.navigate([`/patient/${data.Uid}`]);
  }

  async addFamily() {
    let patient: User = await this.data$
      .pipe(
        first(),
        map(x => x.data)
      )
      .toPromise();
    const modal = await this.modalController.create({
      component: FamilyFormComponent,
      componentProps: { patient: patient }
    });
    modal.onWillDismiss().then(res => {
      if (res && res.data) {
        this.loadFamilies(patient.Uid);
      }
    });
    return await modal.present();
  }
  loadPatientDetails(patientId: string) {
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
  loadFamilies(patientId: string) {
    this.userService
      .getPatientFamilies(patientId)
      .pipe(
        catchError(err => {
          this.family$.next({ error: true });
          return err;
        })
      )
      .subscribe(res => {
        console.log(res);
        if (res && res.length > 0) this.family$.next({ data: res });
        else this.family$.next({ empty: true });
      });
  }

  async addToWatch() {
    let patient: User = await this.data$
      .pipe(
        first(),
        map(x => x.data)
      )
      .toPromise();

    if (patient && patient.Uid) {
      const modal = await this.modalController.create({
        component: SyncDeviceComponent,
        componentProps: { patient: patient }
      });
      modal.onWillDismiss().then(res => {
        if (res && res.data) {
          this.userService.watchPatient(patient.Uid, res.data);
        }
      });
      await modal.present();
    } else {
      await this.themeService.alert("Error", "Invalid patient details :( ");
    }
  }

  async removeFromWatch() {
    let patient: User = await this.data$
      .pipe(
        first(),
        map(x => x.data)
      )
      .toPromise();

    if (patient && patient.Uid) {
      await this.userService.unWatchPatient(patient.Uid);
    } else {
      this.themeService.alert("Error", "Invalid patient details :( ");
    }
  }
}
