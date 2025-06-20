import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto) {
        const user = await this.authService.login(body);

        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }
        return user;
    }

    @Post('register')
    async register(@Body() body: LoginDto) {
        const user = await this.authService.createUser(body);
        return user;
    }
}
