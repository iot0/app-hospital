import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { User } from "../../models/user";

@Component({
  selector: "app-device-threshold",
  templateUrl: "./device-threshold.component.html",
  styleUrls: ["./device-threshold.component.scss"]
})
export class DeviceThresholdComponent implements OnInit {
  createForm: FormGroup;
  @Input() data;
  constructor(private fb: FormBuilder, public modalController: ModalController) {
    this.initForm();
  }

  ngOnInit() {
    console.log(this.data);
    if (this.data) {
      this.patchForm(this.data);
    }
  }

  initForm() {
    this.createForm = this.fb.group({
      minTemp: ["", Validators.required],
      maxTemp: ["", Validators.required],
      minHeartRate: ["", Validators.required],
      maxHeartRate: ["", Validators.required],
      minPressure: ["", Validators.required],
      maxPressure: ["", Validators.required]
    });
  }

  patchForm(data) {
    this.createForm.patchValue({
      minTemp: data.minTemp,
      maxTemp: data.maxTemp,
      minHeartRate: data.minHeartRate,
      maxHeartRate: data.maxHeartRate,
      minPressure: data.minPressure,
      maxPressure: data.maxPressure
    });
  }

  onClose() {
    this.modalController.dismiss();
  }

  prepareSaveInfo(): User {
    const formModel = this.createForm.value;
    return formModel;
  }

  onSubmit() {
    if (this.createForm.valid) {
      let data = this.prepareSaveInfo();
      this.modalController.dismiss(data);
    }
  }
}
