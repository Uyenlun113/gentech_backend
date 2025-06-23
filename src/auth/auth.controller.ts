import { Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { AuthGuard } from '@nestjs/passport';

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

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getProfile(@Request() req) {
        return req.user; 
    }
}
