import { IsNotEmpty, IsString, IsDecimal, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description?: string;

  @IsDecimal()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsDecimal()
  @IsPositive()
  @IsNotEmpty()
  stock: number;
}
