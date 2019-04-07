import { User } from './user';

export class Notification {
  Id: string;
  To: User;
  From: User;
  Message: string;
  Type: NotificationType;
  IsRead:boolean;
}

export enum NotificationType {
  Ambulance = 1,
  Presciption
}
