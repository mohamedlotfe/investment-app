import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerifyKycDto } from './dto/verify-kyc.dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  //@Roles('admin')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post('verify-kyc')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify user KYC',
    description: 'Sets user.isVerified to true after successful KYC check',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification successful',
    schema: {
      properties: {
        message: { type: 'string' },
        userId: { type: 'string' },
        isVerified: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async verifyKyc(
    @Body() verifyKycDto: VerifyKycDto,
    @CurrentUser() user: User,
  ): Promise<{ message: string; userId: string; isVerified: boolean }> {
    console.log('verifyKycDto', verifyKycDto.verificationDocument);
    const selectedUser = await this.usersService.verifyUser(user.id);
    return {
      message: 'KYC verification successful',
      userId: selectedUser.id,
      isVerified: selectedUser.isVerified,
    };
  }

  // @Post('kyc')
  // @UseGuards(JwtAuthGuard)
  // async submitKyc(
  //   @Body() kycDto: KycDTO,
  //   @CurrentUser() user: User,
  // ): Promise<User> {
  //   return this.usersService.submitKyc(user.id, kycDto);
  // }

  //   @Post('kyc/:id/approve')
  //   @UseGuards(RolesGuard)
  //  // @Roles('admin')
  //   approveKyc(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
  //     return this.usersService.approveKyc(id);
  //   }

  //   @Post('kyc/:id/reject')
  //   @UseGuards(RolesGuard)
  //  // @Roles('admin')
  //   rejectKyc(
  //     @Param('id', ParseUUIDPipe) id: string,
  //     @Body('reason') reason: string,
  //   ): Promise<User> {
  //     return this.usersService.rejectKyc(id, reason);
  //   }

  @Get('stats/count')
  async getUserStats() {
    const total = await this.usersService.countUsers();
    const verified = await this.usersService.countVerifiedUsers();

    return {
      total,
      verified,
      unverified: total - verified,
      verificationRate:
        total > 0 ? ((verified / total) * 100).toFixed(2) + '%' : '0%',
    };
  }
}
