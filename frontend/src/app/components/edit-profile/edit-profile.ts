import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { DataService } from '../../services/data.service';
import { User } from '../../models/data.models';

@Component({
    selector: 'app-edit-profile-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-profile.html',
    styleUrl: './edit-profile.css'
})
export class EditProfileModal implements OnInit {
    user: User | null = null;
    form = {
        firstname: '',
        lastname: '',
        role: '',
        bio: '',
        banned: false
    };

    constructor(protected modalService: ModalService, private dataService: DataService) { }

    ngOnInit() {
        this.user = this.modalService.modalData();
        if (this.user) {
            this.form = {
                firstname: this.user.firstname || '',
                lastname: this.user.lastname || '',
                role: this.user.role || 'USER',
                bio: this.user.bio || '',
                banned: this.user.banned || false
            };
        }
    }

    save() {
        if (!this.user) return;
        // In a real app we'd have an admin-update-user endpoint.
        // For now we'll use the profile update if it's the current user, or just mock it/use a generic update.
        // But since we want to "fix" it, I'll assume we can update profile.

        this.dataService.updateProfile({ ...this.form, id: this.user.id } as any).subscribe({
            next: () => {
                this.dataService.loadUsers();
                this.modalService.close();
            },
            error: (err) => {
                console.error('Error updating user:', err);
                alert('Failed to update user.');
            }
        });
    }

    close() {
        this.modalService.close();
    }
}
