export interface IPaymentDTO{
    amount?: number;
    paymentMethod?: string;
    appointmentId?: number
}

export class PaymentDTO implements IPaymentDTO{
    constructor(
        public amount?: number,
        public paymentMethod?: string,
        public appointmentId?: number,
    ){}
}