import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../core/services/leave.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent {
  @Output() close = new EventEmitter<void>();

  type = 'Annual';
  startDate = '';
  endDate = '';
  reason = '';

  constructor(
    private leaveService: LeaveService,
    private auth: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<ApplyLeaveComponent>
  ) {}

async apply() {
  try {
    const user = await firstValueFrom(this.auth.user$);

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.startDate || !this.endDate) {
      alert('Please select dates');
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (start > end) {
      alert('Start date cannot be after end date');
      return;
    }

    const days = this.leaveService.calculateWorkingDays(start, end);

    if (days === 0) {
      alert('Selected dates do not include working days');
      return;
    }

    // 🔥 GET BALANCE
    const balance = await this.leaveService.getLeaveBalance(user.uid);

    const typeBalance = balance[this.type];

    if (!typeBalance) {
      alert('Invalid leave type');
      return;
    }

    if (days > typeBalance.remaining) {
      alert(
        `Not enough ${this.type} leave. Remaining: ${typeBalance.remaining}`
      );
      return;
    }

    await this.leaveService.applyLeave(user.uid, {
      type: this.type,
      startDate: this.startDate,
      endDate: this.endDate,
      days,
      reason: this.reason
    });

    alert('Leave applied successfully!');
    this.dialogRef.close(true);

  } catch (err) {
    console.error(err);
    alert('Failed to apply for leave');
  }
}

}