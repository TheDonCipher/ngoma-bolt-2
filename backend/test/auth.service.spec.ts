import { Test } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('verify', () => {
    it('should verify signature and return token', async () => {
      const mockUser = {
        id: '1',
        address: '0x123',
        nonce: 'test-nonce',
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      
      const result = await authService.verify('message', 'signature');
      
      expect(result).toHaveProperty('token');
    });
  });
});
