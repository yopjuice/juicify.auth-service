import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { User } from './user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepo } from '../../infrastructure/user/user.repo';
import { UserFixtures } from './fixtures/user.fixture';
import { createUserRepoMock } from './mocks/user.mock';

describe('UserService', () => {
  let service: UserService;
  let repo: UserRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepo,
          useValue: createUserRepoMock(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<UserRepo>(UserRepo);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return created user', async () => {
      const dto = UserFixtures.createDto();
      const expected = UserFixtures.entity();
      vi.spyOn(repo, 'create').mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const expected = UserFixtures.array();
      vi.spyOn(repo, 'findAll').mockResolvedValue(expected);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no users are found', async () => {
      const expected = [];
      vi.spyOn(repo, 'findAll').mockResolvedValue(expected);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return an user', async () => {
      const expected = UserFixtures.entity();
      vi.spyOn(repo, 'findById').mockResolvedValue(expected);

      const result = await service.findById(expected.id);

      expect(repo.findById).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(User);
    });

    it('should return null if the user is not found', async () => {
      vi
        .spyOn(repo, 'findById')
      .mockResolvedValue(null);

      const result = await service.findById('non-existent-id');

      expect(repo.findById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toEqual(null);
    });
  });

  describe('getById', () => {
    it('should return an user', async () => {
      const expected = UserFixtures.entity();
      vi.spyOn(repo, 'findById').mockResolvedValue(expected);

      const result = await service.findById(expected.id);

      expect(repo.findById).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(User);
    });

    it('should throw an error if the user is not found', async () => {
      vi
        .spyOn(repo, 'findById')
      .mockResolvedValue(null);

      const result = service.getById('non-existent-id');

      expect(repo.findById).toHaveBeenCalledWith('non-existent-id');
      await expect(result).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('findByEmail', () => {
    it('should return an user', async () => {
      const expected = UserFixtures.entity();
      vi.spyOn(repo, 'findByEmail').mockResolvedValue(expected);

      const result = await service.findByEmail(expected.email);

      expect(repo.findByEmail).toHaveBeenCalledWith(expected.email);
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(User);
    });

    it('should return null if the user is not found', async () => {
      vi
        .spyOn(repo, 'findByEmail')
      .mockResolvedValue(null);

      const result = await service.findByEmail('non-existent-id');

      expect(repo.findByEmail).toHaveBeenCalledWith('non-existent-id');
      expect(result).toEqual(null);
    });
  });

  describe('getByEmail', () => {
    it('should return an user', async () => {
      const expected = UserFixtures.entity();
      vi.spyOn(repo, 'findByEmail').mockResolvedValue(expected);

      const result = await service.getByEmail(expected.email);

      expect(repo.findByEmail).toHaveBeenCalledWith(expected.email);
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(User);
    });

    it('should throw an error if the user is not found', async () => {
      vi
        .spyOn(repo, 'findByEmail')
      .mockResolvedValue(null);

      const result = service.getByEmail('non-existent-id');

      expect(repo.findByEmail).toHaveBeenCalledWith('non-existent-id');
      await expect(result).rejects.toThrow(EntityNotFoundError);
    });
  });
  describe('update', () => {
    it('should return the updated user', async () => {
      const dto = UserFixtures.updateDto();
      const expected = UserFixtures.entity();
      vi.spyOn(repo, 'update').mockResolvedValue(expected);

      const result = await service.update(expected.id, dto);

      expect(repo.update).toHaveBeenCalledWith(expected.id, dto);
      expect(result).toEqual(expected);
    });

    it('should throw an error if the user is not found', async () => {
      const dto = UserFixtures.updateDto();
      vi
        .spyOn(repo, 'update')
        .mockRejectedValue(new EntityNotFoundError('user'));

      const result = service.update('non-existent-id', dto);

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(repo.update).toHaveBeenCalledWith('non-existent-id', dto);
    });
  });

  describe('delete', () => {
    it('should return undefined on success', async () => {
      const expected = UserFixtures.entity();
      vi.spyOn(repo, 'delete').mockResolvedValue(true);

      const result = await service.delete(expected.id);

      expect(repo.delete).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(true);
    });

    it('should throw an error if the user is not found', async () => {
      vi
        .spyOn(repo, 'delete')
        .mockRejectedValue(new EntityNotFoundError('user'));

      const result = service.delete('non-existent-id');

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(repo.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
