// import { Injectable } from "@nestjs/common";
// import { DatabaseProvider } from "../db/db.provider";
//
//
// @Injectable()
// export class TokenRepo {
//
//   constructor(
//     private readonly db: DatabaseProvider,
//   ) { }
//
//   async updateRefreshToken(id: string, token: string): Promise<void> {
//     await this.db.runOne(tokenUpdate, { id, token });
//   }
// }
