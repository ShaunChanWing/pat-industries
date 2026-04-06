import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp,query, where,doc , deleteDoc, updateDoc } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { LeaveRequest } from '../models/leave.model';
import { firstValueFrom } from 'rxjs';

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
    const currentYear = new Date().getFullYear();

    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    return leaves.reduce((total, leave) => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);

      if (leaveEnd < leaveStart) return total;

      // 🔥 Clamp leave to current year
      const start = leaveStart < startOfYear ? startOfYear : leaveStart;
      const end = leaveEnd > endOfYear ? endOfYear : leaveEnd;

      if (end < start) return total;

      const days = this.calculateWorkingDays(start, end);

      return total + days;

    }, 0);
  }

  calculateWorkingDays(start: Date, end: Date): number {
    if (end < start) return 0;

    let days = 0;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {

      const day = d.getDay();
      const year = d.getFullYear();

      const iso = d.toISOString().split('T')[0];
      const holidays = this.getPublicHolidays(year);

      const isWeekend = day === 0 || day === 6;
      const isHoliday = holidays.includes(iso);

      if (!isWeekend && !isHoliday) {
        days++;
      }
    }

    return days;
  }

  getPublicHolidays(year: number): string[] {
    const easter = this.getEasterDate(year);

    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);

    const easterMonday = new Date(easter);
    easterMonday.setDate(easter.getDate() + 1);

    const format = (d: Date) => d.toLocaleDateString('en-CA');

    return [
      `${year}-01-01`,
      `${year}-03-21`,
      format(goodFriday),      // 🔥 Good Friday
      format(easterMonday),    // 🔥 Family Day
      `${year}-04-27`,
      `${year}-05-01`,
      `${year}-06-16`,
      `${year}-08-09`,
      `${year}-09-24`,
      `${year}-12-16`,
      `${year}-12-25`,
      `${year}-12-26`
    ];
  }

  getEasterDate(year: number): Date {
    const f = Math.floor;

    const a = year % 19;
    const b = f(year / 100);
    const c = year % 100;
    const d = f(b / 4);
    const e = b % 4;
    const g = f((8 * b + 13) / 25);
    const h = (19 * a + b - d - g + 15) % 30;
    const j = f(c / 4);
    const k = c % 4;
    const m = (a + 11 * h) / 319;
    const r = (2 * e + 2 * j - k - h + m + 32) % 7;
    const n = f((h - m + r + 90) / 25);
    const p = (h - m + r + n + 19) % 32;

    return new Date(year, n - 1, p);
  }

  getMyLeaves(uid: string) {
    const ref = collection(this.firestore, 'leaveRequests');
    const q = query(ref, where('userId', '==', uid));

    return collectionData(q, { idField: 'id' }) as Observable<LeaveRequest[]>;
  }

  deleteLeave(id: string) {
    const ref = doc(this.firestore, `leaveRequests/${id}`);
    return deleteDoc(ref);
  }

  async getLeaveBalance(uid: string): Promise<any> {
    const leaves = await firstValueFrom(this.getApprovedLeave(uid));

    const allowances = {
      Annual: 15,
      Sick: 30,
      Family: 3,
      Maternity: 120,
      Paternity: 10
    };

    const result: any = {};

    for (const type of Object.keys(allowances)) {

      const typeLeaves = leaves.filter((l: any) => l.type === type);

      const used = this.calculateUsedDays(typeLeaves);
      const allowance = allowances[type as keyof typeof allowances];

      result[type] = {
        allowance,
        used,
        remaining: Math.max(0, allowance - used)
      };
    }

    return result;
  }

  getPendingLeaves() {
    const ref = collection(this.firestore, 'leaveRequests');

    const q = query(ref, where('status', '==', 'pending'));

    return collectionData(q, { idField: 'id' });
  }

  updateLeaveStatus(id: string, status: 'approved' | 'rejected') {
    const ref = doc(this.firestore, `leaveRequests/${id}`);
    return updateDoc(ref, { status });
  }


  getUpcomingApprovedLeaves() {
    const ref = collection(this.firestore, 'leaveRequests');

    const q = query(
      ref,
      where('status', '==', 'approved')
    );

    return collectionData(q, { idField: 'id' });
  }
  
}