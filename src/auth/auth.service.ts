/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDTO } from './dto/login.dto';
import { JwtPayload, TokenDTO } from './dto/token.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/models/user.model';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    // Find user by email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    try {
      const hashedPass = user.toJSON().passwordHash;
      // Compare the hashed password
      await bcrypt.compare(password, hashedPass);
      return user.toJSON();
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  async login(loginDto: LoginDTO): Promise<TokenDTO> {
    // Validate user credentials
    const user = await this.validateUser(loginDto.email, loginDto.password);

    // Create JWT payload
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      roles: user.roles || [],
    };

    // Generate JWT token
    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN', 3600); // Default: 1 hour
    const accessToken = this.jwtService.sign(payload, { expiresIn });

    this.logger.log(`User ${user.email} logged in successfully`);

    return {
      accessToken,
      expiresIn,
    };
  }

  async register(registerDto: RegisterDTO): Promise<User> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    // Create new user
    const newUser = await this.usersService.create({
      email: registerDto.email,
      passwordHash,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      isVerified: false, // By default, users are not verified
    });

    this.logger.log(`New user registered: ${newUser.email}`);

    return newUser;
  }

  async refreshToken(userId: string): Promise<TokenDTO> {
    // Find user by ID
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    // Create JWT payload
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      roles: user.roles || [],
    };

    // Generate new JWT token
    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN', 3600); // Default: 1 hour
    const accessToken = this.jwtService.sign(payload, { expiresIn });

    this.logger.log(`Token refreshed for user ${user.email}`);

    return {
      accessToken,
      expiresIn,
    };
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
