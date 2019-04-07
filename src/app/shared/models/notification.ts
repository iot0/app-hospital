import { User } from './user';

export class AppNotification {
  Id?: string;
  To?: User;
  From?: User;
  Message?: string;
  Type?: NotificationType;
  IsRead?:boolean;
  Patient?:User;
}

export enum NotificationType {
  Ambulance = 1,
  Presciption
}
