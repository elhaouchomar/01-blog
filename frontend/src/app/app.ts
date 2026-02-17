import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ModalService } from './core/services/modal.service';
import { CreatePost } from './components/create-post/create-post';
import { EditPost } from './components/edit-post/edit-post';
import { PostDetails } from './components/post-details/post-details';
import { CreateUser } from './components/create-user/create-user';
import { EditProfileModal } from './components/edit-profile/edit-profile';
import { AdminEditUser } from './components/admin-edit-user/admin-edit-user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, CreatePost, EditPost, PostDetails, CreateUser, EditProfileModal, AdminEditUser],
  templateUrl: './app.html',
  styles: ['.blur { filter: blur(2px); pointer-events: none; transition: all 0.3s; }']
})
export class App {
  constructor(protected modalService: ModalService, private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      const match = (event.urlAfterRedirects || event.url).match(/\/post\/(\d+)/);
      if (match) {
        this.modalService.open('post-details', { id: +match[1] });
        this.router.navigate(['/home'], { replaceUrl: true });
      }
    });
  }
}
