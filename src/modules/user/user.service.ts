import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepo } from '../../infrastructure/user/user.repo';
import { User } from './user.entity';
import { EntityNotFoundError } from '../../shared/errors/domain-errors';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepo) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }
  async create(dto: CreateUserDto): Promise<User> {
    return this.userRepository.create(dto);
  }


  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    return user;
  }

  async getById(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new EntityNotFoundError('user');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) throw new EntityNotFoundError('user');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    return this.userRepository.update(id, dto);
  }

  async delete(id: string): Promise<boolean> {
    await this.userRepository.delete(id);
    return true;
  }
}
