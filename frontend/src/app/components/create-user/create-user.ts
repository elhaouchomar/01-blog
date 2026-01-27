import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-create-user',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-user.html',
    styleUrl: './create-user.css'
})
export class CreateUser {
    form = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'USER'
    };

    constructor(
        protected modalService: ModalService,
        private dataService: DataService,
        private toastService: ToastService
    ) { }

    createUser() {
        if (!this.form.email || !this.form.password) return;

        this.dataService.provisionUser({
            firstname: this.form.firstname,
            lastname: this.form.lastname,
            email: this.form.email,
            password: this.form.password,
            role: this.form.role // Sending role
        }).subscribe({
            next: (res) => { // Accept response but do nothing with token if admin
                // Admin creates user, we don't want to log in as the new user.
                // The DataService.register logs us in automatically which is the issue.
                // However, since we are likely already modifying DataService or deciding how to handle this...

                // Ideally, DataService should have a separate method or parameter to NOT set token.
                // But for now, since we are inside the component...

                // Actually, the previous step added a 'next' block but didn't remove the old one properly or merged poorly?
                // Let's just fix it to be one next block.

                this.dataService.loadUsers();
                this.toastService.success('User created successfully');
                this.modalService.close();
            },
            error: (err: any) => {
                console.error('Error creating user:', err);
                this.toastService.error('Failed to create user. Please try again.');
            }
        });
    }

    close() {
        this.modalService.close();
    }
}
