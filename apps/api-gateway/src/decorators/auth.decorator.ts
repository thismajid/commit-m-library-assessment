import { LoginDto, RegisterDto } from '@app/dtos/auth.dto';
import { applyDecorators, HttpCode } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiRegister = () =>
  applyDecorators(
    ApiOperation({ summary: 'Register user' }),
    ApiResponse({ status: 201, description: 'User registered successfully' }),
    ApiBadRequestResponse({ status: 400, description: 'User already exists' }),
    ApiBody({ type: RegisterDto }),
    HttpCode(201),
  );

export const ApiLogin = () =>
  applyDecorators(
    ApiOperation({ summary: 'Login user' }),
    ApiResponse({ status: 200, description: 'User login successfully' }),
    ApiBadRequestResponse({ status: 400, description: 'Invalid credentials' }),
    ApiBody({ type: LoginDto }),
    HttpCode(200),
  );
