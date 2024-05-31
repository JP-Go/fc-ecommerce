import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
  ArrayNotEmpty,
  IsPositive,
  Min,
  IsInt,
} from 'class-validator';

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  cardHash: string;
}

export class OrderItemDto {
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  productId: string;
}
