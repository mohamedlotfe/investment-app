import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { KycDTO } from './dto/kyc.dto';
import { HashUtil } from '../common/utils/hash.util';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: { exclude: ['passwordHash'] },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user.toJSON();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email: email.toLowerCase() } });
  }

  async create(createUserDto: CreateUserDTO): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = await this.userModel.create(createUserDto as Partial<User>);

    // Log user creation with hashed ID for privacy
    this.logger.log(
      `Created new user with ID: ${HashUtil.hashSensitiveData(user.id)}`,
    );
    return user.toJSON();
  }

  async update(id: string, updateUserDto: UpdateUserDTO): Promise<User> {
    // Update the user using the model's update method.
    const [affectedCount, [updatedUser]] = await this.userModel.update(
      updateUserDto,
      {
        where: { id },
        returning: true, // Return the updated rows (works in PostgreSQL)
      },
    );

    if (affectedCount === 0 || !updatedUser) {
      throw new NotFoundException(
        `User with ID "${id}" not found after update`,
      );
    }

    this.logger.log(`Updated user with ID: ${HashUtil.hashSensitiveData(id)}`);
    return updatedUser.toJSON();
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await user.destroy();
    this.logger.log(`Removed user with ID: ${HashUtil.hashSensitiveData(id)}`);
  }

  async verifyUser(id: string): Promise<User> {
    //const user = await this.findById(id);
    //user.isVerified = true;
    const user = await this.update(id, { isVerified: true });

    this.logger.log(`Verified user with ID: ${HashUtil.hashSensitiveData(id)}`);
    return user;
  }

  async updateLastLogin(id: string): Promise<void> {
    const user = await this.findById(id);
    user.lastLogin = new Date();
    await user.save();
  }

  async submitKyc(id: string, kycData: KycDTO): Promise<User> {
    const user = await this.findById(id);

    // Update KYC data
    user.kycData = {
      ...kycData,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
    };

    await user.save();
    this.logger.log(
      `KYC data submitted for user with ID: ${HashUtil.hashSensitiveData(id)}`,
    );
    return user;
  }

  //   async approveKyc(id: string): Promise<User> {
  //     const user = await this.findById(id);

  //     if (!user.kycData) {
  //       throw new NotFoundException('No KYC data found for this user');
  //     }

  //     // Update KYC status
  //     user.kycData = {
  //       ...user.kycData,
  //       status: 'APPROVED',
  //       approvedAt: new Date().toISOString(),
  //     };

  //     // Mark user as verified
  //     user.isVerified = true;

  //     await user.save();
  //     this.logger.log(
  //       `KYC approved for user with ID: ${HashUtil.hashSensitiveData(id)}`,
  //     );
  //     return user;
  //   }

  //   async rejectKyc(id: string, reason: string): Promise<User> {
  //     const user = await this.findById(id);

  //     if (!user.kycData) {
  //       throw new NotFoundException('No KYC data found for this user');
  //     }

  //     // Update KYC status
  //     user.kycData = {
  //       ...user.kycData,
  //       status: 'REJECTED',
  //       rejectedAt: new Date().toISOString(),
  //       rejectionReason: reason,
  //     };

  //     await user.save();
  //     this.logger.log(
  //       `KYC rejected for user with ID: ${HashUtil.hashSensitiveData(id)}`,
  //     );
  //     return user;
  //   }

  async countUsers(): Promise<number> {
    return this.userModel.count();
  }

  async countVerifiedUsers(): Promise<number> {
    return this.userModel.count({
      where: { isVerified: true },
    });
  }
}
