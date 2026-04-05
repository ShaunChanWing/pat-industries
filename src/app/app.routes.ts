import { Routes } from '@angular/router';
import { LoginComponent } from './auth/auth/login/login.component';

// import { ApprovalsComponent } from './admin/approvals/approvals.component';
import { EmployeeHomeComponent } from './employee/employee-home/employee-home.component';
import { RegisterComponent } from './auth/auth/register/register.component';
import { ApplyLeaveComponent } from './employee/apply-leave/apply-leave.component';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },


  
  
  // Employee
  { path: 'employee-home', component: EmployeeHomeComponent },
  { path: 'apply', component: ApplyLeaveComponent },
  
  
  
  
  //Admin
  // { path: 'admin', component: ApprovalsComponent }
];