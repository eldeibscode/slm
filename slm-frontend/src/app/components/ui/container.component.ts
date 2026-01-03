import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ' + class">
      <ng-content></ng-content>
    </div>
  `,
})
export class ContainerComponent {
  @Input() class = '';
}
