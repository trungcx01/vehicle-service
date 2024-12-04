export interface ILoginDTO{
    username?: string;
    password?: string;
}

export class LoginDTO implements ILoginDTO{
    constructor(
        public username?: string,
        public password?: string
    ){}
}