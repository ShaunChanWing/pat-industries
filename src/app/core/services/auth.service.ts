import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  authState,
  User
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  public user$: Observable<User | null>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.user$ = authState(this.auth);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string, employeeData: any) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((cred) => {
        const userId = cred.user.uid;

        return setDoc(doc(this.firestore, `employees/${userId}`), {
          email,
          ...employeeData,
          createdAt: new Date()
        });
      });
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getUserData(uid: string) {
  const ref = doc(this.firestore, `employees/${uid}`);
    return getDoc(ref).then(doc => doc.data());
  }
}