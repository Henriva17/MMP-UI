import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
password = '';

constructor(
  private userService: UserService,
  private router: Router
) {}

onSubmit(): void {
  console.log('Login attempt:', this.email, this.password);

  // TEMPORARY FAKE LOGIN
  this.router.navigate(['/choose-role']);
}
}