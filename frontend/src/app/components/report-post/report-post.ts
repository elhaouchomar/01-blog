import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-report-post',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './report-post.html',
  styleUrl: './report-post.css'
})
export class ReportPost {
  constructor(protected modalService: ModalService) { }
}
