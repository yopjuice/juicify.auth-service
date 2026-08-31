import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { User } from '../../modules/user/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepo } from './user.repo';
import { UserFixtures } from '../../modules/user/fixtures/user.fixture';
import { DatabaseProvider } from '../../infrastructure/db/db.provider';
import { createDatabaseProviderMock } from '../../modules/user/mocks/db.mock';

describe('UserRepo', () => {
  let repo: UserRepo;
  let dbConfig: DatabaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepo,
        {
          provide: DatabaseProvider,
          useValue: createDatabaseProviderMock(),
        },
      ],
    }).compile();

    repo = module.get<UserRepo>(UserRepo);
    dbConfig = module.get<DatabaseProvider>(DatabaseProvider);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('create', () => {
    it('should return created user', async () => {
      const dto = UserFixtures.createDto();
      const expected = UserFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(UserFixtures.raw());

      const result = await repo.create(dto);

      expect(dbConfig.runOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const expected = UserFixtures.array();
      vi
        .spyOn(dbConfig, 'run')
        .mockResolvedValue(UserFixtures.rawArray());

      const result = await repo.findAll();

      expect(dbConfig.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no users are found', async () => {
      const expected = [];
      vi.spyOn(dbConfig, 'run').mockResolvedValue(expected);

      const result = await repo.findAll();

      expect(dbConfig.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return an user', async () => {
      const expected = UserFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(UserFixtures.raw());

      const result = await repo.findById(expected.id);

      expect(dbConfig.runOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(User);
    });

    it('should return null if the user is not found', async () => {
      const expected = null;
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(null);

      const result = await repo.findById('non-existent-id');

      expect(dbConfig.runOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should return the updated user', async () => {
      const dto = UserFixtures.updateDto();
      const expected = UserFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(UserFixtures.raw());
      
      vi.spyOn(dbConfig, 'queryOne').mockResolvedValue(UserFixtures.raw());

      const result = await repo.update(expected.id, dto);

      expect(dbConfig.queryOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should throw an error if the user is not found', async () => {
      const dto = UserFixtures.updateDto();
      vi
        .spyOn(dbConfig, 'queryOne')
        .mockRejectedValue(new EntityNotFoundError('user'));

      const result = repo.update('non-existent-id', dto);

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(dbConfig.runOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return true on success', async () => {
      const expected = UserFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(UserFixtures.raw());

      const result = await repo.delete(expected.id);

      expect(dbConfig.runOne).toHaveBeenCalledTimes(2);
      expect(result).toEqual(true);
    });

    it('should throw an error if the user is not found', async () => {
      vi
        .spyOn(dbConfig, 'runOne')
        .mockRejectedValue(new EntityNotFoundError('user'));

      const result = repo.delete('non-existent-id');

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(dbConfig.runOne).toHaveBeenCalled();
    });
  });
});
