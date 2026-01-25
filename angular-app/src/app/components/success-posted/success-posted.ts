import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';


@Component({
  selector: 'app-success-posted',
  standalone: true,
  imports: [],
  templateUrl: './success-posted.html',
  styleUrl: './success-posted.css'
})
export class SuccessPosted {
  constructor(protected modalService: ModalService) { }

  close() {
    this.modalService.close();
  }
}
