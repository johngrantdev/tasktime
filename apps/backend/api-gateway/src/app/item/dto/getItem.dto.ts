import { IsString, IsNotEmpty } from 'class-validator';

export class GetItemDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;
}
