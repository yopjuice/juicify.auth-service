import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { TokenRepo } from '../../infrastructure/token/token.repo';
import { TokenFixtures } from './fixtures/token.fixture';
import { createAutoMock } from '../../shared/utils/auto-mock';
import { MyConfigModule } from '../../config/config.module';
import { JwtModule } from '@nestjs/jwt';
import { UserFixtures } from '../user/fixtures/user.fixture';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

describe('TokenService', () => {
  let service: TokenService;
  let repo: TokenRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: TokenRepo,
          useValue: createAutoMock(TokenRepo),
        },
      ],
      imports: [
        MyConfigModule,
        JwtModule.register({}),
      ]
    }).compile();

    service = module.get<TokenService>(TokenService);
    repo = module.get<TokenRepo>(TokenRepo);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: add more specific tests for all methods

  describe('generateAndSaveTokens', () => {
    it('should return tokens', async () => {
      const user = UserFixtures.entity();
      const expected = TokenFixtures.entity(user);
      vi.mocked(repo.create).mockResolvedValue(expected);

      const result = await service.generateAndSaveTokens(user.id, user.email, user.role);

      expect(repo.create).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('generateTokens', () => {
    it('should return tokens', async () => {
      const user = UserFixtures.entity();
      const expected = TokenFixtures.entity(user);

      const result = await service.generateTokens(user.id, user.email, user.role, expected.id);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should return payload', async () => {
      const user = UserFixtures.entity();
      const { refreshToken: token } = await service.generateTokens(user.id, user.email, user.role);

      const result = await service.verifyRefreshToken(token);

      expect(result).toHaveProperty('sub');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('role');
    });
  });

  describe('refreshTokens', () => {
    it('should return tokens', async () => {
      const user = UserFixtures.entity();
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      }
      const { refreshToken } = await service.generateTokens(user.id, user.email, user.role);
      const hashedToken = await service.hashToken(refreshToken);
      const expected = TokenFixtures.entity({ token_hash: hashedToken });
      vi.mocked(repo.findById).mockResolvedValue(expected);
      vi.mocked(repo.create).mockResolvedValue(expected);

      const result = await service.refreshTokens(payload, expected.id, refreshToken);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');

    });
  });


  describe('delete', () => {
    it('should return true on success', async () => {
      const expected = TokenFixtures.entity();
      vi.mocked(repo.delete).mockResolvedValue(true);

      const result = await service.delete(expected.id);

      expect(repo.delete).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(true);
    });

    it('should throw an error if the token is not found', async () => {
      vi.mocked(repo.delete).mockRejectedValue(new EntityNotFoundError('token'));

      const result = service.delete('non-existent-id');

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(repo.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('deleteByUser', () => {
    it('should return true on success', async () => {
      const expected = TokenFixtures.entity();
      vi.mocked(repo.deleteByUser).mockResolvedValue(true);

      const result = await service.deleteByUser(expected.id);

      expect(repo.deleteByUser).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(true);
    });

    it('should throw an error if the token is not found', async () => {
      vi.mocked(repo.deleteByUser).mockRejectedValue(new EntityNotFoundError('token'));

      const result = service.deleteByUser('non-existent-id');

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(repo.deleteByUser).toHaveBeenCalledWith('non-existent-id');
    });
  });

});
