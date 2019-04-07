import { Component, AfterViewInit, ViewEncapsulation } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { UserService } from "../shared/services/user.service";
import { User } from "../shared/models/user";
import { Router } from "@angular/router";
import { LocationService } from "../shared/components/location/location.service";
import { ThemeService } from '../shared/services/theme.service';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  // encapsulation:ViewEncapsulation.None
})
export class HomePage implements AfterViewInit {
  user: User;
  patient: User;
  drawerOptions: any;
  constructor(
    public userService: UserService,
    private themeService: ThemeService,
    private router: Router,
    private mapService: LocationService
  ) {
    this.user = this.userService.currentUserObj();
    this.drawerOptions = {
      handleHeight: 50,
      thresholdFromBottom: 200,
      thresholdFromTop: 200,
      bounceBack: true
    };
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
  onTracking(latLng) {
    console.log(latLng);
    if (latLng) {
      this.mapService.openModal({ enableSelection: false, marker: JSON.parse(latLng) });
    } else {
      this.themeService.alert("Missing Location Info", "Please check if the location is properly configured for the patient.");
    }
  }
}
