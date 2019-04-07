import { Injectable } from "@angular/core";
import { FirestoreService } from "./firestore.service";
import { User } from "../models/user";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  collectionName: string = "Notifications";
  constructor(private firestoreService: FirestoreService) {}

  getSentItems(from: User) {
    return this.firestoreService.colWithIds$<User>(this.collectionName, ref => {
      return ref.where("From.Uid", "==", from.Uid).limit(20);
    });
  }

  getReceivedItems(to: User) {
    return this.firestoreService.colWithIds$<User>(this.collectionName, ref => {
      return ref.where("From.Uid", "==", to.Uid).limit(20);
    });
  }

  updateReadStatus(docId) {
    return this.firestoreService.update<Notification>(`${this.collectionName}/${docId}`, { IsRead: true });
  }
}
