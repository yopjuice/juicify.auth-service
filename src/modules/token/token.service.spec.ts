// import { EntityNotFoundError } from '../../shared/errors/domain-errors';
// import { Token } from './token.entity';
// import { Test, TestingModule } from '@nestjs/testing';
// import { TokenService } from './token.service';
// import { TokenRepo } from '../../infrastructure/token/token.repo';
// import { TokenFixtures } from './fixtures/token.fixture';
// import { createTokenRepoMock } from './mocks/token.mock';
//
// describe('TokenService', () => {
//   let service: TokenService;
//   let repo: TokenRepo;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         TokenService,
//         {
//           provide: TokenRepo,
//           useValue: createTokenRepoMock(),
//         },
//       ],
//     }).compile();
//
//     service = module.get<TokenService>(TokenService);
//     repo = module.get<TokenRepo>(TokenRepo);
//
//     vi.clearAllMocks();
//   });
//
//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
//
//   describe('create', () => {
//     it('should return created token', async () => {
//       const dto = TokenFixtures.createDto();
//       const expected = TokenFixtures.entity();
//       vi.spyOn(repo, 'create').mockResolvedValue(expected);
//
//       const result = await service.create(dto);
//
//       expect(repo.create).toHaveBeenCalledWith(dto);
//       expect(result).toEqual(expected);
//     });
//   });
//
//   describe('findAll', () => {
//     it('should return a list of tokens', async () => {
//       const expected = TokenFixtures.array();
//       vi.spyOn(repo, 'findAll').mockResolvedValue(expected);
//
//       const result = await service.findAll();
//
//       expect(repo.findAll).toHaveBeenCalled();
//       expect(result).toEqual(expected);
//     });
//
//     it('should return an empty list if no tokens are found', async () => {
//       const expected = [];
//       vi.spyOn(repo, 'findAll').mockResolvedValue(expected);
//
//       const result = await service.findAll();
//
//       expect(repo.findAll).toHaveBeenCalled();
//       expect(result).toEqual(expected);
//     });
//   });
//
//   describe('findById', () => {
//     it('should return an token', async () => {
//       const expected = TokenFixtures.entity();
//       vi.spyOn(repo, 'findById').mockResolvedValue(expected);
//
//       const result = await service.findById(expected.id);
//
//       expect(repo.findById).toHaveBeenCalledWith(expected.id);
//       expect(result).toEqual(expected);
//       expect(result).toBeInstanceOf(Token);
//     });
//
//     it('should throw an error if the token is not found', async () => {
//       vi
//         .spyOn(repo, 'findById')
//         .mockRejectedValue(new EntityNotFoundError('token'));
//
//       const result = service.findById('non-existent-id');
//
//       expect(repo.findById).toHaveBeenCalledWith('non-existent-id');
//       await expect(result).rejects.toThrow(EntityNotFoundError);
//     });
//   });
//
//   describe('update', () => {
//     it('should return the updated token', async () => {
//       const dto = TokenFixtures.updateDto();
//       const expected = TokenFixtures.entity();
//       vi.spyOn(repo, 'update').mockResolvedValue(expected);
//
//       const result = await service.update(expected.id, dto);
//
//       expect(repo.update).toHaveBeenCalledWith(expected.id, dto);
//       expect(result).toEqual(expected);
//     });
//
//     it('should throw an error if the token is not found', async () => {
//       const dto = TokenFixtures.updateDto();
//       vi
//         .spyOn(repo, 'update')
//         .mockRejectedValue(new EntityNotFoundError('token'));
//
//       const result = service.update('non-existent-id', dto);
//
//       await expect(result).rejects.toThrow(EntityNotFoundError);
//       expect(repo.update).toHaveBeenCalledWith('non-existent-id', dto);
//     });
//   });
//
//   describe('delete', () => {
//     it('should return undefined on success', async () => {
//       const expected = TokenFixtures.entity();
//       vi.spyOn(repo, 'delete').mockResolvedValue(true);
//
//       const result = await service.delete(expected.id);
//
//       expect(repo.delete).toHaveBeenCalledWith(expected.id);
//       expect(result).toEqual(true);
//     });
//
//     it('should throw an error if the token is not found', async () => {
//       vi
//         .spyOn(repo, 'delete')
//         .mockRejectedValue(new EntityNotFoundError('token'));
//
//       const result = service.delete('non-existent-id');
//
//       await expect(result).rejects.toThrow(EntityNotFoundError);
//       expect(repo.delete).toHaveBeenCalledWith('non-existent-id');
//     });
//   });
// });
