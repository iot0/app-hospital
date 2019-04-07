import { Injectable } from "@angular/core";
import { FirestoreService } from "./firestore.service";
import { User } from "../models/user";
import { AngularFireAuth } from "@angular/fire/auth";
import { AppNotification } from '../models/notification';

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  collectionName: string = "Notifications";
  constructor(private firestoreService: FirestoreService, public afAuth: AngularFireAuth) {}

  async createNotification(data: AppNotification) {
    return await this.firestoreService.add(`${this.collectionName}`, data);
  }

  getSentItems(from: string) {
    return this.firestoreService.colWithIds$<User>(this.collectionName, ref => {
      return ref.where("From.Uid", "==", from).limit(20);
    });
  }

  getReceivedItems(to: string) {
    return this.firestoreService.colWithIds$<User>(this.collectionName, ref => {
      return ref.where("To.Uid", "==", to).limit(20);
    });
  }

  getReceivedItemsByFrom(from: string, to: string) {
    return this.firestoreService.colWithIds$<User>(this.collectionName, ref => {
      return ref
        .where("From.Uid", "==", from)
        .where("To.Uid", "==", to)
        .limit(20);
    });
  }

  updateReadStatus(docId) {
    return this.firestoreService.update<Notification>(`${this.collectionName}/${docId}`, { IsRead: true });
  }
}
