import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' =
    'default';
  @Input() class = '';

  get badgeClasses(): string {
    const base = 'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium';

    const variants: Record<string, string> = {
      default: 'bg-primary-100 text-primary-700',
      primary: 'bg-primary-100 text-primary-700',
      secondary: 'bg-secondary-100 text-secondary-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700',
    };

    return `${base} ${variants[this.variant]} ${this.class}`;
  }
}
