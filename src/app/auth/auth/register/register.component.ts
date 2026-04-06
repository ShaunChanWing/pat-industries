import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  email = '';
  password = '';

  name = '';
  surname = '';
  dob = '';
  idNumber = '';
  taxNumber = '';
  address = '';
  emergencyContactName = '';
  emergencyContactNumber = '';

  constructor(private auth: AuthService, private router: Router) {}

  async register() {
    try {
      await this.auth.register(this.email, this.password, {
        name: this.name,
        surname: this.surname,
        dob: this.dob,
        idNumber: this.idNumber,
        taxNumber: this.taxNumber || null, // optional
        address: this.address,
        emergencyContactName: this.emergencyContactName,
        emergencyContactNumber: this.emergencyContactNumber,
        role: 'employee'
      });

      alert('Registration Successfull!, You are being redirected to the the Login Page ,Please login with your email an Password');
      this.router.navigate(['/login']);

    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Registration failed');
    }
  }
}