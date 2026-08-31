// import { Injectable, ForbiddenException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { AuthTokens } from './interfaces/auth.interface';
// import * as bcrypt from 'bcrypt';
//
// @Injectable()
// export class TokenService {
//   constructor(
//     private jwtService: JwtService,
//   ) {}
//
//   // Генерация новой пары токенов и создание сессии в БД
//   async generateAndSaveTokens(userId: string, email: string, role: string): Promise<AuthTokens> {
//     // 1. Сначала создаем пустую запись сессии в БД, чтобы получить tokenId
//     const session = await this.prisma.token.create({
//       data: {
//         userId,
//         hashedRt: '', // Временно пустой, обновим через секунду
//       },
//     });
//
//     // 2. Генерируем токены. В Refresh зашиваем tokenId сессии!
//     const [accessToken, refreshToken] = await Promise.all([
//       this.jwtService.signAsync(
//         { sub: userId, email, role },
//         { secret: process.env.JWT_ACCESS_SECRET || 'SUPER_SECRET_KEY', expiresIn: '15m' }
//       ),
//       this.jwtService.signAsync(
//         { sub: userId, tokenId: session.id }, // Храним id сессии внутри токена
//         { secret: process.env.JWT_REFRESH_SECRET || 'SUPER_REFRESH_KEY', expiresIn: '7d' }
//       ),
//     ]);
//
//     // 3. Хэшируем полученный рефреш и сохраняем в созданную сессию
//     const hashedRt = await bcrypt.hash(refreshToken, 10);
//     await this.prisma.token.update({
//       where: { id: session.id },
//       data: { hashedRt },
//     });
//
//     return { access_token: accessToken, refresh_token: refreshToken };
//   }
//
//   // Метод обновления токенов (Token Rotation)
//   async refreshTokens(tokenId: string, refreshToken: string, userId: string, email: string, role: string): Promise<AuthTokens> {
//     // Ищем конкретную сессию по tokenId из токена
//     const session = await this.prisma.token.findUnique({ where: { id: tokenId } });
//
//     // Если сессии нет или токен не совпадает с хэшем
//     if (!session || !(await bcrypt.compare(refreshToken, session.hashedRt))) {
//       throw new ForbiddenException('Access Denied / Invalid Session');
//     }
//
//     // Удаляем старую использованную сессию (Защита от повторного использования токена)
//     await this.prisma.token.delete({ where: { id: tokenId } });
//
//     // Генерируем абсолютно новую сессию и токены
//     return this.generateAndSaveTokens(userId, email, role);
//   }
//
//   // Удаление одной конкретной сессии (Логаут с текущего устройства)
//   async invalidateSession(tokenId: string): Promise<void> {
//     await this.prisma.token.deleteMany({ where: { id: tokenId } });
//   }
//
//   // Удаление вообще всех сессий пользователя (Выйти на всех устройствах)
//   async invalidateAllUserSessions(userId: string): Promise<void> {
//     await this.prisma.token.deleteMany({ where: { userId } });
//   }
// }
