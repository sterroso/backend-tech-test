import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  userId: string;
  items: CreateOrderItemDto[];

  get total() {
    return this.items.reduce((sum, item) => (sum += item.subtotal), 0);
  }
}
