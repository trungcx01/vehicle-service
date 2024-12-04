export interface IShopDTO{
    id?: number,
    userId?: number,
    address?: string,
    name?: string,
    phoneNumber?:string,
    description?: string,
    openHour?: any,
    closeHour?: any
}

export class ShopDTO implements IShopDTO{
    constructor(
        public id?: number,
        public userId?: number,
        public address?: string,
        public name?: string,
        public description?: string,
        public phoneNumber?:string,
        public openHour?: any,
        public closeHour?: any
    ) {}
}