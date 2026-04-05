import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-employee-summary',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './employee-summary.component.html',
  styleUrls: ['./employee-summary.component.css']
})
export class EmployeeSummaryComponent implements OnInit {

  user: any;
  employee: any;

  constructor(
    private auth: AuthService,
    private employeeService: EmployeeService
  ) {

this.employee = toSignal(
  this.auth.user$.pipe(
    switchMap(user => {
      console.log('USER:', user);

      if (!user) return of(null);

      return this.employeeService.getEmployee(user.uid);
    })
  ),
  { initialValue: null }
);

  }

ngOnInit() {}

}