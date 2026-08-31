import { IsUUID } from 'class-validator';

export class GetArtistDto {
  @IsUUID()
  id: string;
}
