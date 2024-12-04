export interface IShopDTO{
    id?: number,
    userId?: number,
    address?: string,
    name?: string,
    phoneNumber?:string,
    description?: string,
    openingHour?: string
}

export class ShopDTO implements IShopDTO{
    constructor(
        public id?: number,
        public userId?: number,
        public address?: string,
        public name?: string,
        public description?: string,
        public phoneNumber?:string,
        public openingHour?: string
    ) {}
}