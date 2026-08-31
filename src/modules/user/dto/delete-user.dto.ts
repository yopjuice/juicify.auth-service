import { IsUUID } from 'class-validator';

export class DeleteArtistDto {
  @IsUUID()
  id: string;
}
