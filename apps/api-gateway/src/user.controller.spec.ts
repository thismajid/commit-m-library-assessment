import { Test, TestingModule } from '@nestjs/testing';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, of } from 'rxjs';
import { UserController } from './user.controller';
import { UpdateProfileDto } from '@app/dtos/users.dto';
import { JwtAuthGuard } from './guards';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: any;
  let mockClientGrpc: Partial<ClientGrpc>;

  beforeEach(async () => {
    mockUserService = {
      getUserProfile: jest.fn(),
      updateUserProfile: jest.fn(),
    };

    mockClientGrpc = {
      getService: jest.fn().mockReturnValue(mockUserService),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: 'USER_PACKAGE',
          useValue: mockClientGrpc,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<UserController>(UserController);
    controller.onModuleInit();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('profile', () => {
    it('should return user profile', async () => {
      const mockProfile = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };
      mockUserService.getUserProfile.mockReturnValue(of(mockProfile));

      const req = { user: { userId: '1' } };
      const result = await lastValueFrom(controller.profile(req));

      expect(mockUserService.getUserProfile).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateData: UpdateProfileDto = { name: 'Jane Doe' };
      const mockUpdatedProfile = {
        id: '1',
        name: 'Jane Doe',
        email: 'john@example.com',
      };
      mockUserService.updateUserProfile.mockReturnValue(of(mockUpdatedProfile));

      const req = { user: { userId: '1' } };
      const result = await lastValueFrom(
        controller.updateProfile(req, updateData),
      );

      expect(mockUserService.updateUserProfile).toHaveBeenCalledWith({
        id: '1',
        name: 'Jane Doe',
      });
      expect(result).toEqual(mockUpdatedProfile);
    });
  });

  describe('error handling', () => {
    it('should handle errors in profile fetch', async () => {
      mockUserService.getUserProfile.mockReturnValue(
        of({ error: 'Profile not found' }),
      );

      const req = { user: { userId: '1' } };
      const result = await lastValueFrom(controller.profile(req));

      expect(result).toEqual({ error: 'Profile not found' });
    });

    it('should handle errors in profile update', async () => {
      mockUserService.updateUserProfile.mockReturnValue(
        of({ error: 'Update failed' }),
      );

      const req = { user: { userId: '1' } };
      const updateData: UpdateProfileDto = { name: 'Jane Doe' };
      const result = await lastValueFrom(
        controller.updateProfile(req, updateData),
      );

      expect(result).toEqual({ error: 'Update failed' });
    });
  });
});
