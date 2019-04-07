import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User, UserRole } from "../models/user";
import { map, tap, first } from "rxjs/operators";
import { AngularFirestoreCollection } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { FirestoreService } from "./firestore.service";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root"
})
export class UserService {
  collectionName: string = "Users";
  localKey: string = "user";
  userSubject: BehaviorSubject<User> = new BehaviorSubject(null);

  currentUser$: Observable<User> = this.userSubject.asObservable();

  isLoggedIn$: Observable<boolean> = this.userSubject.asObservable().pipe(map(x => !!x));

  isDoctor$: Observable<boolean> = this.currentUser$.pipe(
    map(x => {
      return x ? x.Role == UserRole.Doctor : false;
    })
  );

  isHospital$: Observable<boolean> = this.currentUser$.pipe(
    map(x => {
      return x ? x.Role == UserRole.Hospital : false;
    })
  );

  isPatient$: Observable<boolean> = this.userSubject.asObservable().pipe(
    map(x => {
      return x ? x.Role == UserRole.Patient : false;
    })
  );

  isFamily$: Observable<boolean> = this.userSubject.asObservable().pipe(
    map(x => {
      return x ? x.Role == UserRole.Family : false;
    })
  );

  userCollection: AngularFirestoreCollection<User>;
  constructor(private router: Router, private firestoreService: FirestoreService, public afAuth: AngularFireAuth) {
    const user = window.localStorage[this.localKey];
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  isAuthenticated(): boolean {
    if (this.userSubject.value) return true;
    return false;
  }

  currentUserObj(): User {
    return this.userSubject.value;
  }

  async register(user: User) {
    const res = await this.afAuth.auth.createUserWithEmailAndPassword(user.EmailId, user.Password);
    user.Uid = res.user.uid;
    this.firestoreService.set(`${this.collectionName}/${res.user.uid}`, user);
    return user;
  }

  async login(user: User) {
    const res = await this.afAuth.auth.signInWithEmailAndPassword(user.EmailId, user.Password);
    user.Uid = res.user.uid;

    // get user details

    let userDoc = await this.getUserDetailsAsAsync(user.Uid);

    window.localStorage[this.localKey] = JSON.stringify(userDoc);
    this.userSubject.next(userDoc);

    return userDoc;
  }

  async logOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(["/welcome"]).then(() => {
      this.userSubject.next(null);
      window.localStorage.removeItem(this.localKey);
    });
  }

  async getUserDetailsAsAsync(uid: string) {
    return await this.firestoreService
      .doc$<User>(`${this.collectionName}/${uid}`)
      .pipe(first())
      .toPromise();
  }
  getUserDetails(docId: string) {
    return this.firestoreService.docWithId$(`${this.collectionName}/${docId}`);
  }
  updateDoc(updatedUser, docId): any {
    return this.firestoreService.update(`${this.collectionName}/${docId}`, updatedUser);
  }

  getByRole(role: UserRole): Observable<any> {
    return this.firestoreService.colWithIds$<User>(this.collectionName, ref => {
      return ref.where("Role", "==", role).limit(20);
    });
  }

  getPatientFamilies(patientId: string): Observable<any> {
    console.log(patientId);
    console.log(UserRole.Family);
    return this.firestoreService.colWithIds$<User>(this.collectionName, ref => {
      return ref
        .where("Role", "==", UserRole.Family)
        .where("Patient.Uid", "==", patientId)
        .limit(20);
    });
  }

  getDoctorPatients(doctorId: string): Observable<any> {
    return this.firestoreService.colWithIds$<User>(this.collectionName, ref => {
      return ref
        .where("Role", "==", UserRole.Patient)
        .where("Doctor.Uid", "==", doctorId)
        .limit(20);
    });
  }

  getWatchingDevices(doctorId:string){
    return this.firestoreService.colWithIds$<User>(this.collectionName, ref => {
      return ref
        .where("Role", "==", UserRole.Patient)
        .where("IsWatching", "==", true)
        .where("Doctor.Uid", "==", doctorId)
        .limit(20);
    });
  }
  async watchPatient(patientId: string,ip:string) {
    return this.firestoreService.update<User>(`${this.collectionName}/${patientId}`, { IsWatching: true ,DeviceIp:ip});
  }
  async unWatchPatient(patientId: string) {
    return this.firestoreService.update(`${this.collectionName}/${patientId}`, { IsWatching: false });
  }
}
