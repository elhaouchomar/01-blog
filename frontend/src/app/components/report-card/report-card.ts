import { Component, Input, Output, EventEmitter, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { ModerationReport } from '../../shared/models/moderation.models';
import { User, UserSummaryDTO } from '../../shared/models/data.models';

type ReportAction = 'resolve' | 'toggleVisibility' | 'deletePost' | 'banUser' | 'deleteUser';

@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-card.component.html',
  styleUrl: './report-card.component.css'
})
export class ReportCardComponent {
  @Input({ required: true }) report!: ModerationReport;
  @Output() onAction = new EventEmitter<{ report: ModerationReport, action: ReportAction }>();
  @Output() onViewTarget = new EventEmitter<ModerationReport>();

  currentUser: User | null = null;

  constructor(private dataService: DataService) {
    effect(() => {
      this.currentUser = this.dataService.currentUser();
    });
  }

  get targetUser(): UserSummaryDTO | null {
    return this.report.reportedUser ?? this.report.reportedPostAuthor ?? null;
  }
}
