import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { UserService } from "../../shared/services/user.service";
import { SelectDoctorComponent } from "../../shared/components/select-doctor/select-doctor.component";
import { User, UserRole } from "src/app/shared/models/user";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ThemeService } from "src/app/shared/services/theme.service";
import { generatePassword } from "src/app/shared/helper";

@Component({
  selector: "app-patient-form",
  templateUrl: "./patient-form.component.html",
  styleUrls: ["./patient-form.component.scss"]
})
export class PatientFormComponent implements OnInit {
  createForm: FormGroup;
  todaysDate: string = new Date().toISOString();

  @Output("success")
  onSuccess:EventEmitter<User>=new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    public modalController: ModalController,
    private userService: UserService
  ) {
    this.initForm();
  }

  ngOnInit() {}

  initForm() {
    this.createForm = this.fb.group({
      fullName: ["", Validators.required],
      dob: ["", Validators.required],
      emailId: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      latLng: ["", Validators.required],
      address: ["", Validators.required],
      doctor: [null, Validators.required]
    });
  }

  onClose() {
    this.modalController.dismiss();
  }

  onLocationSelect(location) {
    if (location) {
      this.createForm.get("latLng").setValue(JSON.stringify(location));
    }
  }

  async openDoctorSelectModal() {
    const modal = await this.modalController.create({
      component: SelectDoctorComponent
    });
    modal.onWillDismiss().then(res => {
      if (res.data) {
        this.createForm.patchValue({
          doctor: { Uid: res.data.Uid, FullName: res.data.FullName }
        });
      }
    });
    return await modal.present();
  }

  prepareSaveInfo(): User {
    const formModel = this.createForm.value;
    let user: User = {
      FullName: formModel.fullName,
      DOB: formModel.dob,
      EmailId: formModel.emailId,
      PhoneNumber: formModel.phoneNumber,
      Address: formModel.address,
      Role: UserRole.Patient,
      Password: generatePassword(formModel.dob, formModel.emailId),
      Doctor: formModel.doctor
    };
    return user;
  }

  onSubmit() {
    console.log(this.createForm);
    if (this.createForm.valid) {
      this.themeService.progress(true);
      let data = this.prepareSaveInfo();

      this.userService
        .register(data)
        .then(res => {
          this.themeService.alert("Success", "Doctor registration successful");
          console.log(res);
          this.onSuccess.emit(res);
        })
        .catch(err => {
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
