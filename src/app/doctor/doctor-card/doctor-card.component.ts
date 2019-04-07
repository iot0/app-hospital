import { Component, OnInit, Input } from '@angular/core';
import { database } from 'firebase';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-doctor-card',
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.scss'],
})
export class DoctorCardComponent implements OnInit {

  @Input("data")
  data:User;
  constructor() { }

  ngOnInit() {}

}
