import { Test, TestingModule } from '@nestjs/testing';
import { ClientGrpc } from '@nestjs/microservices';
import { of, throwError, lastValueFrom } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;
  let mockClientGrpc: Partial<ClientGrpc>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    mockClientGrpc = {
      getService: jest.fn().mockReturnValue(mockAuthService),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AUTH_PACKAGE',
          useValue: mockClientGrpc,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    controller.onModuleInit(); // Call this manually to set up the authService
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with correct parameters', async () => {
      const registerData = {
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
      };
      const expectedResponse = {
        success: true,
        message: 'User registered successfully',
      };

      mockAuthService.register.mockReturnValue(of(expectedResponse));

      const result = await lastValueFrom(controller.register(registerData));

      expect(mockAuthService.register).toHaveBeenCalledWith(registerData);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw BadRequestException for invalid register data', async () => {
      const invalidRegisterData = { name: '', username: '', password: 'short' };

      mockAuthService.register.mockImplementation(() =>
        throwError(() => new BadRequestException()),
      );

      await expect(
        lastValueFrom(controller.register(invalidRegisterData)),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const loginData = { username: 'testuser', password: 'password123' };
      const expectedResponse = {
        success: true,
        message: 'Login successful',
        token: 'fake_token',
      };

      mockAuthService.login.mockReturnValue(of(expectedResponse));

      const result = await lastValueFrom(controller.login(loginData));

      expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw BadRequestException for invalid login data', async () => {
      const invalidLoginData = { username: '', password: 'short' };

      mockAuthService.login.mockImplementation(() =>
        throwError(() => new BadRequestException()),
      );

      await expect(
        lastValueFrom(controller.login(invalidLoginData)),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
