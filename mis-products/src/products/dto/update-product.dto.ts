import { IsDecimal, IsPositive, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  newName?: string;

  @IsString()
  newDescription?: string;

  @IsDecimal()
  @IsPositive()
  newPrice?: number;

  @IsDecimal()
  @IsPositive()
  newStock?: number;
}
