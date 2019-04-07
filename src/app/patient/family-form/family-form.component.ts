import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ThemeService } from "../../shared/services/theme.service";
import { ModalController } from "@ionic/angular";
import { UserService } from "../../shared/services/user.service";
import { User, UserRole } from "../../shared/models/user";
import { generatePassword } from "../../shared/helper";

@Component({
  selector: "app-family-form",
  templateUrl: "./family-form.component.html",
  styleUrls: ["./family-form.component.scss"]
})
export class FamilyFormComponent implements OnInit {
  createForm: FormGroup;
  todaysDate: string = new Date().toISOString();
  patient: User;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    public modalController: ModalController,
    private userService: UserService
  ) {
    this.initForm();
  }

  ngOnInit() {
    console.log(this.patient);
  }

  initForm() {
    this.createForm = this.fb.group({
      fullName: ["", Validators.required],
      dob: ["", Validators.required],
      emailId: ["", Validators.required],
      phoneNumber: ["", Validators.required]
    });
  }

  onClose() {
    this.modalController.dismiss();
  }

  prepareSaveInfo(): User {
    const formModel = this.createForm.value;
    let user: User = {
      FullName: formModel.fullName,
      Role: UserRole.Family,
      EmailId: formModel.emailId,
      PhoneNumber: formModel.phoneNumber,
      Password: generatePassword(formModel.dob, formModel.emailId),
      DOB: formModel.dob,
      Patient: {
        Uid: this.patient.Uid,
        FullName: this.patient.FullName
      }
    };
    return user;
  }

  onSubmit() {
    console.log(this.createForm);
    if (!this.patient || !this.patient.Uid) {
      this.themeService.alert("Error", "Invalid Patient details ");
      return;
    }
    if (this.createForm.valid) {
      this.themeService.progress(true);
      let data = this.prepareSaveInfo();

      this.userService
        .register(data)
        .then(res => {
          this.themeService.alert("Success", "Family added successfully");
          this.modalController.dismiss(true);
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
