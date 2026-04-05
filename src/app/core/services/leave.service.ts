import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp,query, where  } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class LeaveService {

  constructor(private firestore: Firestore) {}

  applyLeave(userId: string, data: any) {
    const ref = collection(this.firestore, 'leaveRequests');

    return addDoc(ref, {
      userId,
      ...data,
      status: 'pending', // 🔥 important
      createdAt: serverTimestamp()
    });
  }

  getApprovedLeave(uid: string) {
    const ref = collection(this.firestore, 'leaveRequests');

    const q = query(
      ref,
      where('userId', '==', uid),
      where('status', '==', 'approved')
    );

    return collectionData(q);
  }

  calculateUsedDays(leaves: any[]): number {
    return leaves.reduce((total, leave) => total + leave.days, 0);
  }


}