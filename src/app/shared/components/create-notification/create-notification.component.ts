import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { NotificationService } from "../../services/notification.service";
import { ThemeService } from "../../services/theme.service";
import { catchError, takeWhile } from "rxjs/operators";
import { AppNotification, NotificationType } from "../../models/notification";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-create-notification",
  templateUrl: "./create-notification.component.html",
  styleUrls: ["./create-notification.component.scss"]
})
export class CreateNotificationComponent implements OnInit {
  createForm: FormGroup;
  isAlive: boolean = true;
  from: User;
  to: User;
  latLng: string;
  patient: User;
  notificationType: NotificationType;
  constructor(
    private notificationService: NotificationService,
    private themeService: ThemeService,
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {}
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.createForm = this.fb.group({
      message: ["", Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  getTitle() {
    if (this.notificationType === NotificationType.Ambulance) return "Ambulance Alert";
    else if (this.notificationType === NotificationType.Presciption) return "Medicine Prescription";
  }
  prepareSaveInfo(): AppNotification {
    const formModel = this.createForm.value;
    console.log(formModel);
    let data: AppNotification = {
      Message: formModel.message,
      Type: this.notificationType,
      From: this.from,
      To: this.to
    };
    if (data.Type == NotificationType.Ambulance) {
      data.Patient = this.patient;
      if (!data.To.Uid) data.To.Uid = "hospital";
    }
    return data;
  }

  onClose() {
    this.modalCtrl.dismiss();
  }
  onSubmit() {
    console.log(this.createForm);
    if (this.createForm.valid) {
      this.themeService.progress(true);
      let data = this.prepareSaveInfo();
      console.log(data);
      this.notificationService
        .createNotification(data)
        .then(res => {
          this.themeService.alert("Success", "Notification created successfully .");
          this.modalCtrl.dismiss(true);
        })
        .catch(err => {
          console.log(err);
          this.themeService.progress(false);
          this.themeService.alert("Error", "Sorry something went wrong .");
        })
        .finally(() => {
          this.themeService.progress(false);
        });
    } else {
      this.themeService.alert("Fields Missing", "All Fields are necessary.");
    }
  }
}
