export class User {
  Id?: string;
  Uid?: string;
  FullName?: string;
  EmailId?: string;
  CreatedAt?: Date;
  Role?: UserRole;
  PhoneNumber?: string;
  Password?: string;
  Department?: string;
  JoinedDate?: Date;
  Address?: string;
  DOB?: Date;
  Patient?:User;
  Doctor?:User;
  Hospital?:User;
  Families?:User[];
  IsWatching?:boolean;
  DeviceIp?:string;
  HospitalId?:string;
  LatLng?:string;
}
export enum UserRole {
  Doctor = 1,
  Patient,
  Hospital,
  Family
}
