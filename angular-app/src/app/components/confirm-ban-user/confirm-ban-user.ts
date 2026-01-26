
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-confirm-ban-user',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-ban-user.html',
    styleUrl: '../confirm-delete-post/confirm-delete-post.css', // Reusing the delete style which is now premium
})
export class ConfirmBanUser {
    get user() {
        return this.modalService.modalData();
    }

    constructor(public modalService: ModalService, private dataService: DataService) { }

    toggleBan() {
        if (this.user) {
            this.dataService.toggleBan(this.user.id).subscribe(() => {
                this.modalService.close();
            });
        }
    }
}
