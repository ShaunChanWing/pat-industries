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

            const used = leaves.reduce((sum: number, l: any) => sum + (l.days || 0), 0);
            const allowance = employee.leaveAllowance ?? 15;

            return {
              allowance,
              used,
              remaining: allowance - used
            };
          })
        );
      })
    ),
    { initialValue: null }
  );
}