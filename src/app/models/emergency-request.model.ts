export interface IEmergencyRequestDTO{
    vehicleType?: string,
    licensePlate?: string,
    description?: string,
    imageDetail?: string,
    location?: string,
}

export class EmergencyRequestDTO implements IEmergencyRequestDTO{
    constructor(
        public vehicleType?: string,
        public licensePlate?: string,
        public description?: string,
        public imageDetail?: string,
        public location?: string,
    ){}
}