import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../core/services/leave.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { EventEmitter, Output } from '@angular/core';

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
    private router: Router
  ) {}

  async apply() {
    try {
      const user = await firstValueFrom(this.auth.user$); // ✅ correct place

      if (!user) {
        alert('Not logged in');
        return;
      }

      if (!this.startDate || !this.endDate) {
        alert('Please select dates');
        return;
      }

      const days = this.calculateDays();

      await this.leaveService.applyLeave(user.uid, {
        type: this.type,
        startDate: this.startDate,
        endDate: this.endDate,
        days,
        reason: this.reason
      });

      alert('Leave applied successfully!');

      this.close.emit();

    } catch (err) {
      console.error(err);
      alert('Failed to apply for leave');
    }
  }

  calculateDays(): number {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }
}