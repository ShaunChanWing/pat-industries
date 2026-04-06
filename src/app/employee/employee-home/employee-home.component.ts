import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveHistoryComponent } from '../sub-components/leave-history/leave-history.component';
import { LeaveBalanceCardComponent } from '../sub-components/leave-balance-card/leave-balance-card.component';
import { EmployeeSummaryComponent } from '../sub-components/employee-summary/employee-summary.component';
import { QuickActionsComponent } from '../sub-components/quick-actions/quick-actions.component';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-employee-home',
  standalone: true,
  imports: [CommonModule, LeaveHistoryComponent, LeaveBalanceCardComponent, EmployeeSummaryComponent,QuickActionsComponent],
  templateUrl: './employee-home.component.html',
  styleUrls: ['./employee-home.component.css']
})
export class EmployeeHomeComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(['/login']);
  });
  
  
  }
}
