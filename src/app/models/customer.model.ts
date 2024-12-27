export interface ICustomerDTO{
    id?: number,
    userId?: number,
    address?: string,
    name?: string,
    dob?: string,
    phoneNumber?:string,
    district?: any
}

export class CustomerDTO implements ICustomerDTO{
    constructor(
        public id?: number,
        public userId?: number,
        public address?: string,
        public name?: string,
        public dob?: string,
        public phoneNumber?:string,
        public district?: any
    ) {}
}