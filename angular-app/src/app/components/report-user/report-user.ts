import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';


@Component({
  selector: 'app-report-user',
  standalone: true,
  imports: [],
  templateUrl: './report-user.html',
  styleUrl: './report-user.css'
})
export class ReportUser {
  constructor(protected modalService: ModalService) { }

  close() {
    this.modalService.close();
  }
}
