import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'tm-skeleton',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './skeleton.component.html',
    styleUrl: './skeleton.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
    height = input<string | undefined>();
    borderRadius = input<string | undefined>();
}
