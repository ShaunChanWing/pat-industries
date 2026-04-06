import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { EmployeeService } from "../../../core/services/employee.service";
import { Observable, switchMap, of, map} from "rxjs";

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService, private employeeService: EmployeeService) {}

  canActivate(): Observable<boolean> {
    return this.auth.user$.pipe(
      switchMap(user => {
        if (!user) return of(false);

        return this.employeeService.getEmployee(user.uid).pipe(
          map(emp => emp?.role === 'admin')
        );
      })
    );
  }
}