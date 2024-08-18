import { inject, Injectable } from '@angular/core';
import { ApiService } from '@shared/core';
import { TicketCreateDto } from '../dto';
import { Ticket } from '../interface';

@Injectable({ providedIn: 'root' })
export class TicketApiService {
    static ROOT_POINT = '/tickets';
    static ROOT_POINT_WITH_ID = `${TicketApiService.ROOT_POINT}/:ticketId`;
    static ROOT_POINT_WITH_ID_ASSIGN = `${TicketApiService.ROOT_POINT_WITH_ID}/assign/:userId`;
    static ROOT_POINT_WITH_ID_UNASSIGN = `${TicketApiService.ROOT_POINT_WITH_ID}/unassign`;
    static ROOT_POINT_WITH_ID_COMPLETE = `${TicketApiService.ROOT_POINT_WITH_ID}/complete`;

    private _apiService = inject(ApiService);

    search(query = {}) {
        return this._apiService.get<Ticket[]>(TicketApiService.ROOT_POINT, query);
    }

    get(ticketId: number) {
        return this._apiService.get<Ticket>(TicketApiService.ROOT_POINT_WITH_ID, { ticketId });
    }

    create(payload: TicketCreateDto) {
        return this._apiService.post<Ticket>(TicketApiService.ROOT_POINT, payload);
    }

    assign(userId: number, ticketId: number) {
        return this._apiService.put<Ticket>(TicketApiService.ROOT_POINT_WITH_ID_ASSIGN, { userId, ticketId });
    }

    unassign(ticketId: number) {
        return this._apiService.put<Ticket>(TicketApiService.ROOT_POINT_WITH_ID_UNASSIGN, { ticketId });
    }

    markAsComplete(ticketId: number) {
        return this._apiService.put<Ticket>(TicketApiService.ROOT_POINT_WITH_ID_COMPLETE, { ticketId });
    }

    maskAsIncomplete(ticketId: number) {
        return this._apiService.delete<Ticket>(TicketApiService.ROOT_POINT_WITH_ID_COMPLETE, { ticketId });
    }
}
