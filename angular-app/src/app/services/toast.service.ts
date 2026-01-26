
import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    toasts = signal<Toast[]>([]);
    private counter = 0;

    show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
        const id = this.counter++;
        const toast: Toast = { id, message, type };

        this.toasts.update(current => [...current, toast]);

        setTimeout(() => {
            this.remove(id);
        }, duration);
    }

    success(message: string, duration = 3000) {
        this.show(message, 'success', duration);
    }

    error(message: string, duration = 3000) {
        this.show(message, 'error', duration);
    }

    info(message: string, duration = 3000) {
        this.show(message, 'info', duration);
    }

    remove(id: number) {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }
}
