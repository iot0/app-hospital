import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/shared/services/user.service';
import { User, UserRole } from 'src/app/shared/models/user';
import { generatePassword } from 'src/app/shared/helper';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.scss'],
})
export class DoctorFormComponent implements OnInit {

  createForm: FormGroup;
  todaysDate:string=(new Date()).toISOString();

  constructor(private fb: FormBuilder,
     private themeService: ThemeService,
     public modalController: ModalController,
      private userService: UserService) {
    this.initForm();
  }

  ngOnInit() {
  }

  initForm() {
    this.createForm = this.fb.group({
      fullName: ["", Validators.required],
      joinedDate: ["", Validators.required],
      address: ["", Validators.required],
      emailId: ["", Validators.required],
      dob:["",Validators.required],
      department:["",Validators.required],
    });
  }

  onClose() {
    this.modalController.dismiss();
  }

  prepareSaveInfo(): User {
    const formModel = this.createForm.value;
    let user: User = {
      JoinedDate: formModel.joinedDate,
      Address: formModel.address,
      FullName: formModel.fullName,
      Role:UserRole.Doctor,
      EmailId:formModel.emailId,
      Department:formModel.department,
      Password:generatePassword(formModel.dob,formModel.emailId), 
      DOB:formModel.dob
    };
    return user;
  }

  onSubmit() {
    console.log(this.createForm);
    if (this.createForm.valid) {
      this.themeService.progress(true);
      let data = this.prepareSaveInfo();

      this.userService.register(data)
        .then(res => {
          this.themeService.alert("Success", "Doctor registration successful");
        })
        .catch(err => {
          this.themeService.alert("Error", "Sorry something went wrong .");
        })
        .finally(() => {
          this.themeService.progress(false);
          this.modalController.dismiss();
        });
    } else {
      this.themeService.alert("Fields Missing", "All Fields are necessary.");
    }
  }

}
