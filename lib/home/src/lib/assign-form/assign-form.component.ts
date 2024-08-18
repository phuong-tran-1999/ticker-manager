import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TicketFull, UserApiService } from '@shared/data-access';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';

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
    selector: 'tm-assign-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ...materials],
    templateUrl: './assign-form.component.html',
    styleUrl: './assign-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignFormComponent {
    private _fb = inject(FormBuilder);
    private _destroyRef = inject(DestroyRef);
    private _data = inject(MAT_DIALOG_DATA, { optional: true }) as TicketFull;
    private _snackBar = inject(MatSnackBar);
    private _dialogRef = inject(MatDialogRef<TicketFormComponent>);

    public isEdit = !!this._data;
    public users$ = inject(UserApiService).search();

    public form = this.initForm(this._data);

    initForm(data?: TicketFull) {
        const assigneeData = { id: data?.assigneeId, name: data?.assignee };
        const fg = this._fb.group({
            id: [data?.id],
            assignee: this._fb.control(assigneeData, [Validators.required]),
            assigneeId: [data?.assigneeId],
            completed: [data?.completed],
        });

        const { assignee, assigneeId } = fg.controls;

        assignee.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
            assigneeId.patchValue(value?.id);
        });

        return fg;
    }

    submit() {
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            this._snackBar.open('Form is invalid', 'Close', { duration: 3000 });
            return;
        }

        this._dialogRef.close({ assigneeId: this.form.value.assigneeId });
    }

    compareWithId(a: { id: number }, b: { id: number }) {
        return a.id === b.id;
    }
}
