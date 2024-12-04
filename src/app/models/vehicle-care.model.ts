export interface IVehicleCareDTO{
    id?: number,
    name?: string,
    description?: string,
    price?: number,
    estimatedDuration?: string,
    available?: boolean, 
}

export class vehicleCareDTO implements IVehicleCareDTO{
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public price?: number,
        public estimatedDuration?: string,
        public available?: boolean, 
    ) {}
}