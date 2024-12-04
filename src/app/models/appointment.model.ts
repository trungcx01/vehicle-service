export interface IAppointmentDTO{
     id?: number,
     vehicleType?: number,
     date?: string,
     time?: string,
     vehicleCares?: number[],
     note?:string,
     customerId?: number
}

export class AppointmentDTO implements IAppointmentDTO{
    constructor(
        public id?: number,
        public vehicleType?: number,
        public date?: string,
        public time?: string,
        public vehicleCares?: number[],
        public note?:string,
        public customerId?: number
    ) {}
}