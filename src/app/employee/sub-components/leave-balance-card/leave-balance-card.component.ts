import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, switchMap, of } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { LeaveService } from '../../../core/services/leave.service';

@Component({
  selector: 'app-leave-balance-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-balance-card.component.html',
  styleUrls: ['./leave-balance-card.component.css']
})
export class LeaveBalanceCardComponent {

  // 🔥 use inject (IMPORTANT)
  private auth = inject(AuthService);
  private employeeService = inject(EmployeeService);
  private leaveService = inject(LeaveService);

leaveBalance = toSignal(
  this.auth.user$.pipe(
    switchMap(user => {
      if (!user) return of(null);

      return combineLatest([
        this.employeeService.getEmployee(user.uid),
        this.leaveService.getApprovedLeave(user.uid)
      ]).pipe(
        map(([employee, leaves]) => {
          if (!employee) return null;

        const allowances = {
          Annual:  15,
          Sick: 30,
          Family:  3,
          Maternity: 120,   // 👶 typical ~4 months
          Paternity:  10     // 👨 typical ~10 days
        };

          const result: any = {};

          Object.keys(allowances).forEach(type => {
            const typeLeaves = leaves.filter((l: any) => l.type === type);

            const used = this.leaveService.calculateUsedDays(typeLeaves);
            const allowance = allowances[type as keyof typeof allowances];

            result[type] = {
              allowance,
              used,
              remaining: Math.max(0, allowance - used)
            };
          });

          return result;
        })
      );
    })
  ),
  { initialValue: null }
);
}