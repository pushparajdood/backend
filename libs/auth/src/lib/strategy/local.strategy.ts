import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { User } from '@lms-backend/prisma-client';
import { UsersRepository } from '@lms-backend/data-access';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersRepository: UsersRepository) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      email,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.password) {
      throw new Error('Password is required');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }
}
