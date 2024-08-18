export interface Ticket {
    id: number;
    description: string;
    assigneeId: null | number;
    completed: boolean;
}

export interface TicketFull extends Ticket {
    assignee?: string;
}

export type TicketStatus = 'open' | 'completed';
