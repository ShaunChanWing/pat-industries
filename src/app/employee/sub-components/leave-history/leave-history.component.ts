import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveService } from '../../../core/services/leave.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-history.component.html',
  styleUrls: ['./leave-history.component.css']
})
export class LeaveHistoryComponent {

  private auth = inject(AuthService);

  leaves$ = this.auth.user$.pipe(
    switchMap(user =>
      user ? this.leaveService.getMyLeaves(user.uid) : of([])
    )
  );

  constructor(
    private leaveService: LeaveService
  ) {}

  deleteLeave(id: string) {
  if (!confirm('Are you sure you want to delete this leave request?')) {
    return;
  }

    this.leaveService.deleteLeave(id)
      .then(() => {
        console.log('Deleted successfully');
      })
      .catch(err => {
        console.error(err);
        alert('Failed to delete leave');
      });
  }
}