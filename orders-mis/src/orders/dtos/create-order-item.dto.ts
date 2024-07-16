export class CreateOrderItemDto {
  productId: string;
  salesPrice: number;
  quantity: number;

  get subtotal() {
    return parseFloat((this.salesPrice * this.quantity).toFixed(2));
  }
}
