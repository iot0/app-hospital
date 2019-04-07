import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ModalController } from "@ionic/angular";
import { NotificationService } from "../shared/services/notification.service";
import { UserService } from "../shared/services/user.service";
import { catchError, takeWhile } from "rxjs/operators";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.page.html",
  styleUrls: ["./notification.page.scss"]
})
export class NotificationPage implements OnInit {
  data$: BehaviorSubject<any> = new BehaviorSubject({ loading: true });
  isAlive: boolean = true;
  constructor(private userService: UserService, private notificationService: NotificationService) {
    let user = this.userService.currentUserObj();
    
    this.notificationService
      .getSentItems(user)
      .pipe(
        catchError(err => {
          this.data$.next({ error: true });
          return err;
        }),
        takeWhile(() => this.isAlive)
      )
      .subscribe((res:any)=> {
        if (res && res.length > 0) this.data$.next({ data: res });
        else this.data$.next({ empty: true });
        console.log(res);
      });
  }

  ngOnInit() {}

  // async onCreate() {
  //   const modal = await this.modalController.create({
  //     component: DoctorFormComponent
  //   });
  //   return await modal.present();
  // }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
