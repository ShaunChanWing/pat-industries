import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData} from '@angular/fire/firestore';
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

  getEmployees(): Observable<any[]> {
    const employeesRef = collection(this.firestore, 'employees');
    return collectionData(employeesRef, { idField: 'id' }) as Observable<any[]>;
  }
}