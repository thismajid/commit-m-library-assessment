import { applyDecorators, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards';
import { UpdateProfileDto } from '@app/dtos/users.dto';

export const ApiProfile = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'User profile' }),
    ApiResponse({
      status: 200,
      description: 'User profile fetch successfully',
    }),
    ApiResponse({ status: 401, description: 'Invalid token' }),
    HttpCode(200),
  );

export const ApiUpdateProfile = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update user profile' }),
    ApiResponse({
      status: 200,
      description: 'User profile updated successfully',
    }),
    ApiResponse({ status: 401, description: 'Invalid token' }),
    ApiBody({ type: UpdateProfileDto }),
    HttpCode(200),
  );
