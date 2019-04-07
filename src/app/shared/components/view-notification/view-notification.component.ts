import { Component, OnInit } from "@angular/core";
import { NotificationService } from "../../services/notification.service";
import { catchError, takeWhile } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { ModalController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-view-notification",
  templateUrl: "./view-notification.component.html",
  styleUrls: ["./view-notification.component.scss"]
})
export class ViewNotificationComponent implements OnInit {
  data$: BehaviorSubject<any> = new BehaviorSubject({ loading: true });
  isAlive: boolean = true;
  from: string;
  to: string;
  constructor(private notificationService: NotificationService, private modalCtrl: ModalController, private router: Router) {}

  ngOnInit() {
    if (this.from && this.to) {
      this.loadItemsForUser(this.from, this.to);
    } else if (this.from) {
      this.loadSentItems(this.from);
    } else if (this.to) {
      this.loadReceivedItems(this.to);
    }
  }

  loadSentItems(from: string) {
    this.notificationService
      .getSentItems(from)
      .pipe(
        catchError(err => {
          this.data$.next({ error: true });
          return err;
        }),
        takeWhile(() => this.isAlive)
      )
      .subscribe((res: any) => {
        if (res && res.length > 0) this.data$.next({ data: res });
        else this.data$.next({ empty: true });
        console.log(res);
      });
  }

  loadReceivedItems(to: string) {
    this.notificationService
      .getReceivedItems(to)
      .pipe(
        catchError(err => {
          this.data$.next({ error: true });
          return err;
        }),
        takeWhile(() => this.isAlive)
      )
      .subscribe((res: any) => {
        if (res && res.length > 0) this.data$.next({ data: res });
        else this.data$.next({ empty: true });
        console.log(res);
      });
  }

  loadItemsForUser(from: string, to: string) {
    this.notificationService
      .getReceivedItemsByFrom(from, to)
      .pipe(
        catchError(err => {
          this.data$.next({ error: true });
          return err;
        }),
        takeWhile(() => this.isAlive)
      )
      .subscribe((res: any) => {
        if (res && res.length > 0) this.data$.next({ data: res });
        else this.data$.next({ empty: true });
        console.log(res);
      });
  }
  onClose() {
    this.modalCtrl.dismiss();
  }

  viewPatient(patientId) {
    this.modalCtrl.dismiss();
    this.router.navigate([`patient/${patientId}`]);
  }
}
