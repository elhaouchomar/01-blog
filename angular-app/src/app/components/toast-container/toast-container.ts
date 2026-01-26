
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-toast-container',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="toast-container">
            <div *ngFor="let toast of toastService.toasts()" 
                 class="toast" 
                 [class]="toast.type"
                 (click)="toastService.remove(toast.id)">
                <span class="material-symbols-outlined icon">
                    {{ getIcon(toast.type) }}
                </span>
                <span class="message">{{ toast.message }}</span>
                <span class="material-symbols-outlined close">close</span>
            </div>
        </div>
    `,
    styles: [`
        .toast-container {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            z-index: 9999;
            pointer-events: none;
        }

        .toast {
            min-width: 300px;
            max-width: 400px;
            padding: 1rem 1.25rem;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            pointer-events: auto;
            animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            border: 1px solid rgba(0,0,0,0.05);
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }

        .icon { font-size: 1.25rem; }
        .message { flex: 1; font-weight: 500; font-size: 0.9375rem; color: #1f2937; }
        .close { font-size: 1rem; color: #9ca3af; }

        .toast.success { border-left: 4px solid #22c55e; }
        .toast.success .icon { color: #22c55e; }

        .toast.error { border-left: 4px solid #ef4444; }
        .toast.error .icon { color: #ef4444; }

        .toast.info { border-left: 4px solid #3b82f6; }
        .toast.info .icon { color: #3b82f6; }

        /* Dark mode support logic should be handled by global CSS variables if available, 
           but hardcoding high-contrast dark styles for now to ensure visibility */
        :host-context(.dark) .toast {
            background: #1e1e2f;
            border-color: #2d2d44;
        }
        :host-context(.dark) .message { color: #f3f4f6; }
    `]
})
export class ToastContainer {
    toastService = inject(ToastService);

    getIcon(type: string): string {
        switch (type) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            default: return 'info';
        }
    }
}
