import { Injectable } from '@angular/core';
import { Firestore, doc, docData} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
// import { docData } from 'rxfire/firestore';

@Injectable({ providedIn: 'root' })
export class EmployeeService {

  constructor(private firestore: Firestore) {}

  getEmployee(uid: string) {
    const ref = doc(this.firestore, `employees/${uid}`);
    return docData(ref, { idField: 'id' }) as Observable<Employee>;; // 👈 observable
  }
}