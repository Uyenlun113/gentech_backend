import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    user_name: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class AuthResponseDto {
    success: boolean;
    message: string;
    user: {
        user_id: number;
        user_name: string;
    };
}