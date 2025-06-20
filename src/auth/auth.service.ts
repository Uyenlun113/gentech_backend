
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(user_name: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { user_name },
        });

        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        console.log('Login attempt:', loginDto);
        const user = await this.validateUser(loginDto.user_name, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
        }

        const payload = {
            sub: user.user_id,
            user_name: user.user_name,
        };

        const access_token = this.jwtService.sign(payload);

        return {
            success: true,
            message: 'Đăng nhập thành công',
            access_token,
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
            },
        };
    }

    async createUser(userDto: LoginDto) {
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        const newUser = this.userRepository.create({
            ...userDto,
            password: hashedPassword,
        });
        return this.userRepository.save(newUser);
    }

}