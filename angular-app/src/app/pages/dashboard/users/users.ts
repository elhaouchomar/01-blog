import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserListComponent } from '../../../components/user-list/user-list.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [UserListComponent],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {

}
