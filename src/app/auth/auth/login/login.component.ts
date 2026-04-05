import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',   // 👈 use external HTML
  styleUrls: ['./login.component.css']     // 👈 use external CSS
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    try {
      await this.auth.login(this.email, this.password);
      alert('Logged in!');
      this.router.navigate(['/employee-home'])
    } catch (e) {
      console.error('Login error : ' , e)
      alert('Login failed');
    }
  }

  register() {
    this.router.navigate(['/register'])
  }
}