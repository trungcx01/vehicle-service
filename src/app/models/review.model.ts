export interface IReviewDTO{
    id?: number;
    rate?: number;
    description?: string
    customerId?: number,
    appointmentId?: number,
    proposalId?: number,
}

export class ReviewDTO implements IReviewDTO{
    constructor(
        public id?: number,
        public rate?: number,
        public description?: string,
        public customerId?: number,
        public appointmentId?: number,
        public proposalId?: number,
    ){}
}