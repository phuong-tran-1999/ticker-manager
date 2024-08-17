export interface Ticket {
    id: number;
    description: string;
    assigneeId: null | number;
    completed: boolean;
}
