import { Component, AfterViewInit, ViewEncapsulation, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { UserService } from "../shared/services/user.service";
import { User, UserRole } from "../shared/models/user";
import { Router } from "@angular/router";
import { LocationService } from "../shared/components/location/location.service";
import { ThemeService } from "../shared/services/theme.service";
import { ModalController } from "@ionic/angular";
import { ViewNotificationComponent } from "../shared/components/view-notification/view-notification.component";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
  // encapsulation:ViewEncapsulation.None
})
export class HomePage implements AfterViewInit, OnInit {
  user: User;
  patient: User;
  drawerOptions: any;
  constructor(
    public userService: UserService,
    private themeService: ThemeService,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    console.log(this.user);
    this.drawerOptions = {
      handleHeight: 50,
      thresholdFromBottom: 200,
      thresholdFromTop: 200,
      bounceBack: true
    };
  }
  ngOnInit(): void {
    this.user = this.userService.currentUserObj();
  }
  ngAfterViewInit(): void {}

  async onLogOut() {
    await this.themeService.progress(true);
    try {
      this.userService.logOut();
      this.router.navigate(["welcome"]);
    } catch (err) {
      console.dir(err);
      await this.themeService.toast(err.message);
    } finally {
      await this.themeService.progress(false);
    }
  }
  async openNotifications() {
    let user = this.userService.currentUserObj();
    let props: any = {};
    if (user.Role == UserRole.Patient || user.Role == UserRole.Hospital) {
      props.to = user.Uid;
    } else if (user.Role == UserRole.Family) {
      props.to = user.Patient.Uid;
    } else if (user.Role == UserRole.Doctor) {
      props.from = user.Uid;
    }
    const modal = await this.modalCtrl.create({
      component: ViewNotificationComponent,
      componentProps: props
    });

    return await modal.present();
  }
  patientDetails() {
    let user = this.userService.currentUserObj();
    let uid = null;
    if (user.Role === UserRole.Patient) uid = user.Uid;
    else if (user.Role === UserRole.Family) uid = user.Patient.Uid;

    this.router.navigate([`/patient/${uid}`]);
  }
  doctorDetails() {
    let user = this.userService.currentUserObj();
    this.router.navigate([`/doctor/${user.Uid}`]);
  }
}
