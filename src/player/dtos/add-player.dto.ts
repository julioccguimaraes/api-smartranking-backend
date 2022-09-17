import { IsEmail, IsNotEmpty } from "class-validator"

export class AddPlayerDto {
    @IsNotEmpty()
    readonly phoneNumber: string

    @IsEmail()
    readonly email: string
    
    @IsNotEmpty()
    readonly name: string
}