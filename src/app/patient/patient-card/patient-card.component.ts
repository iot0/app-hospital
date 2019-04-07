import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/shared/models/user";
import { ModalController } from "@ionic/angular";
import { CreateNotificationComponent } from "src/app/shared/components/create-notification/create-notification.component";
import { UserService } from "src/app/shared/services/user.service";
import { NotificationType } from "src/app/shared/models/notification";

@Component({
  selector: "app-patient-card",
  templateUrl: "./patient-card.component.html",
  styleUrls: ["./patient-card.component.scss"]
})
export class PatientCardComponent implements OnInit {
  @Input("data")
  patient: any;
  constructor(private modalController: ModalController, public userService: UserService) {}

  ngOnInit() {}

  calculateAge(date) {
    let yearDiff = new Date().getFullYear() - new Date(date).getFullYear();
    return yearDiff;
  }
  async givePrescription() {
    const modal = await this.modalController.create({
      component: CreateNotificationComponent,
      componentProps: {
        from: this.userService.currentUserObj(),
        to: this.patient,
        notificationType: NotificationType.Presciption
      }
    });
    return await modal.present();
  }
  async alertForAmbulance() {
    let doctor: User = this.userService.currentUserObj();
    const modal = await this.modalController.create({
      component: CreateNotificationComponent,
      componentProps: {
        from: doctor,
        to: { Uid: doctor.HospitalId, FullName: "Hospital" },
        patient: this.patient,
        notificationType: NotificationType.Ambulance
      }
    });
    return await modal.present();
  }
}
