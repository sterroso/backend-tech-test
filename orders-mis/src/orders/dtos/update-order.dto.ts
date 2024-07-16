interface OrderItemUpdateSpecification {
  productId: string;
  newQuantity?: number;
  newSalesPrice?: number;
}

export class UpdateOrderDto {
  itemsUpdates: OrderItemUpdateSpecification[];
}
