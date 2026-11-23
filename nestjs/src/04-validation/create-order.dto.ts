import { IsInt, IsString, Min } from 'class-validator';

// These decorators only store metadata. Nothing checks them unless a ValidationPipe runs.
// The TypeScript types (string, number) are erased at runtime.
export class CreateOrderDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
