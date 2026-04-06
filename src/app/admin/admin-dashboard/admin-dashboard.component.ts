import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../core/services/leave.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {


  employees$: Observable<any[]>;

  openEmployeeIndex: number | null = null;


  leaves$: Observable<any[]>;
  approvedLeaves$: Observable<any[]>;

  activeTab: 'pending' | 'approved' = 'pending';

  constructor(private leaveService: LeaveService,private auth : AuthService, private router : Router, private employeeService: EmployeeService) {
    this.leaves$ = this.leaveService.getPendingLeaves();
    this.approvedLeaves$ = leaveService.getUpcomingApprovedLeaves();
    this.employees$ = this.employeeService.getEmployees();
  }


toggleEmployee(index: number) {
  this.openEmployeeIndex = this.openEmployeeIndex === index ? null : index;
}


  approve(id: string) {
    this.leaveService.updateLeaveStatus(id, 'approved');
  }

  reject(id: string) {
    this.leaveService.updateLeaveStatus(id, 'rejected');
  }

    logout() {
    this.auth.logout().then(() => {
      this.router.navigate(['/login']);
  });
}
}