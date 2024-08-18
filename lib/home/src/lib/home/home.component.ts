import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TICKET_STATUS, TicketApiService, TicketFull, TicketStatus, UserApiService } from '@shared/data-access';
import { SkeletonComponent } from '@shared/ui/skeleton';
import {
    combineLatest,
    filter,
    forkJoin,
    map,
    Observable,
    of,
    startWith,
    Subject,
    switchMap,
    withLatestFrom,
} from 'rxjs';
import { AssignFormComponent } from '../assign-form/assign-form.component';
import { TicketDetailComponent } from '../ticket-detail/ticket-detail.component';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const materials = [
    MatTableModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
];

const components = [AssignFormComponent, TicketFormComponent, TicketDetailComponent, SkeletonComponent];

const nativeComponents = [CommonModule, RouterModule, ReactiveFormsModule];

@Component({
    selector: 'tm-home',
    standalone: true,
    imports: [...nativeComponents, ...components, ...materials],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
    private _fb = inject(FormBuilder);
    private _api = inject(TicketApiService);
    private _dialog = inject(MatDialog);
    private _userApi = inject(UserApiService);
    private _snackbar = inject(MatSnackBar);

    private _userMap = new Map<number, string>();
    private _refreshItems = new Subject<void>();

    public isDrawerOpened = false;
    public statusList = TICKET_STATUS;
    public columns: string[] = ['sn', 'assignee', 'description', 'status', 'action'];
    public statusControl = this._fb.control<TicketStatus | ''>('');
    public items$: Observable<TicketFull[]> = combineLatest([
        this._refreshItems.pipe(startWith(undefined)),
        this.statusControl.valueChanges.pipe(startWith(null)),
    ]).pipe(
        switchMap(([_, status]) =>
            forkJoin({
                items: this._api.search(),
                users: this._userApi.search(),
                status: of(status),
            }).pipe(
                map(({ items, users, status }) => {
                    users.forEach((user) => {
                        this._userMap.set(user.id, user.name);
                    });

                    const fullItems = items.map((item) => ({
                        ...item,
                        assignee: item.assigneeId ? this._userMap.get(item.assigneeId) : '',
                    }));

                    switch (status) {
                        case 'open':
                            return fullItems.filter((item) => !item.completed);
                        case 'completed':
                            return fullItems.filter((item) => item.completed);
                        default:
                            return fullItems;
                    }
                }),
            ),
        ),
    );

    view(item: TicketFull) {
        this._dialog.open(TicketDetailComponent, {
            data: item,
        });
    }

    create() {
        this._dialog
            .open(TicketFormComponent)
            .afterClosed()
            .pipe(
                filter(Boolean),
                switchMap((value) => this._api.create(value)),
            )
            .subscribe(() => {
                this._refreshItems.next();
                this._snackbar.open('Ticket created', 'Close', { duration: 3000 });
            });
    }

    markAsCompleted(item: TicketFull) {
        this._api.markAsComplete(item.id).subscribe((result) => {
            console.log(`Dialog result: ${result}`);
            this._refreshItems.next();
            this._snackbar.open('Ticket marked as completed', 'Close', { duration: 3000 });
        });
    }

    markAsOpen(item: TicketFull) {
        this._api.maskAsIncomplete(item.id).subscribe((result) => {
            console.log(`Dialog result: ${result}`);
            this._refreshItems.next();
            this._snackbar.open('Ticket marked as open', 'Close', { duration: 3000 });
        });
    }

    assign(item: TicketFull) {
        this._dialog
            .open(AssignFormComponent, {
                data: item,
            })
            .afterClosed()
            .pipe(
                filter(Boolean),
                switchMap((value) => this._api.assign(value.assigneeId, item.id)),
            )
            .subscribe(() => {
                this._refreshItems.next();
                this._snackbar.open('Ticket assignee updated', 'Close', { duration: 3000 });
            });
    }

    unassign(item: TicketFull) {
        this._api.unassign(item.id).subscribe(() => {
            this._refreshItems.next();
            this._snackbar.open('Ticket assignee removed', 'Close', { duration: 3000 });
        });
    }
}
