// import { EntityNotFoundError } from '../../shared/errors/domain-errors';
// import { Token } from '../../modules/token/token.entity';
// import { Test, TestingModule } from '@nestjs/testing';
// import { TokenRepo } from './token.repo';
// import { TokenFixtures } from '../../modules/token/fixtures/token.fixture';
// import { DatabaseProvider } from '../../infrastructure/db/db.provider';
// import { createDatabaseProviderMock } from '../../modules/token/mocks/db.mock';
//
// describe('TokenRepo', () => {
//   let repo: TokenRepo;
//   let dbConfig: DatabaseProvider;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         TokenRepo,
//         {
//           provide: DatabaseProvider,
//           useValue: createDatabaseProviderMock(),
//         },
//       ],
//     }).compile();
//
//     repo = module.get<TokenRepo>(TokenRepo);
//     dbConfig = module.get<DatabaseProvider>(DatabaseProvider);
//
//     vi.clearAllMocks();
//   });
//
//   it('should be defined', () => {
//     expect(repo).toBeDefined();
//   });
//
//   describe('create', () => {
//     it('should return created token', async () => {
//       const dto = TokenFixtures.createDto();
//       const expected = TokenFixtures.entity();
//       vi.spyOn(dbConfig, 'runOne').mockResolvedValue(TokenFixtures.raw());
//
//       const result = await repo.create(dto);
//
//       expect(dbConfig.runOne).toHaveBeenCalledTimes(1);
//       expect(result).toEqual(expected);
//     });
//   });
//
//   describe('findAll', () => {
//     it('should return a list of tokens', async () => {
//       const expected = TokenFixtures.array();
//       vi
//         .spyOn(dbConfig, 'run')
//         .mockResolvedValue(TokenFixtures.rawArray());
//
//       const result = await repo.findAll();
//
//       expect(dbConfig.run).toHaveBeenCalled();
//       expect(result).toEqual(expected);
//     });
//
//     it('should return an empty list if no tokens are found', async () => {
//       const expected = [];
//       vi.spyOn(dbConfig, 'run').mockResolvedValue(expected);
//
//       const result = await repo.findAll();
//
//       expect(dbConfig.run).toHaveBeenCalled();
//       expect(result).toEqual(expected);
//     });
//   });
//
//   describe('findById', () => {
//     it('should return an token', async () => {
//       const expected = TokenFixtures.entity();
//       vi.spyOn(dbConfig, 'runOne').mockResolvedValue(TokenFixtures.raw());
//
//       const result = await repo.findById(expected.id);
//
//       expect(dbConfig.runOne).toHaveBeenCalled();
//       expect(result).toEqual(expected);
//       expect(result).toBeInstanceOf(Token);
//     });
//
//     it('should return null if the token is not found', async () => {
//       const expected = null;
//       vi.spyOn(dbConfig, 'runOne').mockResolvedValue(null);
//
//       const result = await repo.findById('non-existent-id');
//
//       expect(dbConfig.runOne).toHaveBeenCalled();
//       expect(result).toEqual(expected);
//     });
//   });
//
//   describe('update', () => {
//     it('should return the updated token', async () => {
//       const dto = TokenFixtures.updateDto();
//       const expected = TokenFixtures.entity();
//       vi.spyOn(dbConfig, 'runOne').mockResolvedValue(TokenFixtures.raw());
//
//       vi.spyOn(dbConfig, 'queryOne').mockResolvedValue(TokenFixtures.raw());
//
//       const result = await repo.update(expected.id, dto);
//
//       expect(dbConfig.queryOne).toHaveBeenCalled();
//       expect(result).toEqual(expected);
//     });
//
//     it('should throw an error if the token is not found', async () => {
//       const dto = TokenFixtures.updateDto();
//       vi
//         .spyOn(dbConfig, 'queryOne')
//         .mockRejectedValue(new EntityNotFoundError('token'));
//
//       const result = repo.update('non-existent-id', dto);
//
//       await expect(result).rejects.toThrow(EntityNotFoundError);
//       expect(dbConfig.runOne).toHaveBeenCalledTimes(1);
//     });
//   });
//
//   describe('delete', () => {
//     it('should return true on success', async () => {
//       const expected = TokenFixtures.entity();
//       vi.spyOn(dbConfig, 'runOne').mockResolvedValue(TokenFixtures.raw());
//
//       const result = await repo.delete(expected.id);
//
//       expect(dbConfig.runOne).toHaveBeenCalledTimes(2);
//       expect(result).toEqual(true);
//     });
//
//     it('should throw an error if the token is not found', async () => {
//       vi
//         .spyOn(dbConfig, 'runOne')
//         .mockRejectedValue(new EntityNotFoundError('token'));
//
//       const result = repo.delete('non-existent-id');
//
//       await expect(result).rejects.toThrow(EntityNotFoundError);
//       expect(dbConfig.runOne).toHaveBeenCalled();
//     });
//   });
// });
