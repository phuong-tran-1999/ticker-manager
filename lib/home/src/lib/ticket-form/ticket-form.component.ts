import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TicketFull, UserApiService } from '@shared/data-access';

const materials = [
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
];

@Component({
    selector: 'tm-ticket-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ...materials],
    templateUrl: './ticket-form.component.html',
    styleUrl: './ticket-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketFormComponent {
    private _fb = inject(FormBuilder);
    private _data = inject(MAT_DIALOG_DATA, { optional: true }) as TicketFull;
    private _snackBar = inject(MatSnackBar);
    private _dialogRef = inject(MatDialogRef<TicketFormComponent>);

    public isEdit = !!this._data;
    public users$ = inject(UserApiService).search();

    public form = this.initForm(this._data);

    initForm(data?: TicketFull) {
        return this._fb.group({
            id: [data?.id],
            // assignee: this._fb.control(assigneeData, [Validators.required]),
            // assigneeId: [data?.assigneeId],
            description: [data?.description, [Validators.maxLength(300), Validators.required]],
            completed: [data?.completed],
        });
    }

    submit() {
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            this._snackBar.open('Form is invalid', 'Close', { duration: 3000 });
            return;
        }

        this._dialogRef.close({ description: this.form.value.description });
    }
}
