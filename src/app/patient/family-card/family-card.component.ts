import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-family-card',
  templateUrl: './family-card.component.html',
  styleUrls: ['./family-card.component.scss'],
})
export class FamilyCardComponent implements OnInit {

  @Input("data")
  userList:User[];

  constructor() { }

  ngOnInit() {}

}
