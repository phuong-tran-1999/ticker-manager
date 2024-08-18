import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TicketFull } from '@shared/data-access';

const materials = [MatDialogModule, MatButtonModule];

@Component({
    selector: 'tm-ticket-detail',
    standalone: true,
    imports: [CommonModule, ...materials],
    templateUrl: './ticket-detail.component.html',
    styleUrl: './ticket-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketDetailComponent {
    public data = inject(MAT_DIALOG_DATA, { optional: true }) as TicketFull;
}
