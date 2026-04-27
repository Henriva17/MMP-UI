import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';


import { UserResponse } from '../../../shared/models/responces/user-response';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userlist.html',
  styleUrl: './userlist.css',
})
export class Userlist implements  OnInit {

  private userService = inject(UserService);

  users: UserResponse[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
        console.log(this.users)
      },
      error: (err) => {
        this.errorMessage = 'Failed to load users.';
        this.isLoading = false;
      }
    });
  }
}
