import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { User } from '../../models/data.models';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, CommonModule],
    templateUrl: './left-sidebar.html',
    styleUrl: './left-sidebar.css'
})
export class SidebarComponent implements OnInit {
    currentUser: User | null = null;

    constructor(private dataService: DataService) {
        this.currentUser = this.dataService.getCurrentUser();
        this.dataService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        // In a real app, we might subscribe to user updates here
    }
}
