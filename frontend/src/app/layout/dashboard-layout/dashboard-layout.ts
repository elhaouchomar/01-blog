import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DataService } from '../../services/data.service';
import { ModalService } from '../../services/modal.service';

import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  isSidebarOpen = false;

  constructor(public modalService: ModalService, private dataService: DataService) { }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.dataService.logout();
  }
}
