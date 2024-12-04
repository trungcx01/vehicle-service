export interface IUserDTO{
    id?: number,
    username?: string,
    password?: string,
    email?: string,
    imageUrl?: string
}

export class UserDTO implements IUserDTO{
    constructor(
        public id?: number,
        public username?: string,
        public password?: string,
        public email?: string,
        public imageUrl?: string
    ) {}
}