import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../core/services/leave.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {


employees = [
  {
    name: 'Yara',
    surname: 'Chan Wing',
    dob: '1995-06-12',
    idNumber: '9506121234082',
    taxNumber: '1234567890',
    address: '123 Main Road, Johannesburg',
    emergencyContactName: 'Shaun Chan',
    emergencyContactNumber: '0821234567',
    role: 'employee'
  },
  {
    name: 'Michael',
    surname: 'Smith',
    dob: '1990-03-22',
    idNumber: '9003225678081',
    taxNumber: null,
    address: '45 Sandton Drive, Johannesburg',
    emergencyContactName: 'Sarah Smith',
    emergencyContactNumber: '0839876543',
    role: 'employee'
  }
];


  openEmployeeIndex: number | null = null;


  leaves$: Observable<any[]>;
  approvedLeaves$: Observable<any[]>;

  activeTab: 'pending' | 'approved' = 'pending';

  constructor(private leaveService: LeaveService,private auth : AuthService, private router : Router) {
    this.leaves$ = this.leaveService.getPendingLeaves();
    this.approvedLeaves$ = leaveService.getUpcomingApprovedLeaves();
    console.log(this.approvedLeaves$)
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