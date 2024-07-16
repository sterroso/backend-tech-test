import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import {
  ListOrdersResponse,
  GetOrderResponse,
  CreateOrderResponse,
  UpdateOrderResponse,
  DeleteOrderResponse,
} from './proto/orders/orders';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async findMany(
    requestUserId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ListOrdersResponse> {
    if (page < 1) {
      throw new RpcException('Page must be a positive integer.');
    }

    if (limit < 1) {
      throw new RpcException('Limit must be a positive integer.');
    }

    const offset = (page - 1) * limit;

    try {
      const [orders, totalItems] = await this.orderRepository.findAndCount({
        where: { userId: requestUserId, deletedAt: undefined },
        order: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      });

      const pageItems = orders.length;
      const hasPreviousPage = page > 1;
      const previousPage = hasPreviousPage ? page - 1 : undefined;
      const hasNextPage = offset + pageItems < totalItems;
      const nextPage = hasNextPage ? page + 1 : undefined;

      const response = {
        orders,
        currentPage: page,
        pageItems,
        totalItems,
        hasPreviousPage,
        previousPage,
        hasNextPage,
        nextPage,
      } as ListOrdersResponse;

      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findOne(
    requestUserId: string,
    orderId: string,
  ): Promise<GetOrderResponse> {
    try {
      const existingOrder = await this.orderRepository.findOneOrFail({
        where: { id: orderId, userId: requestUserId, deletedAt: undefined },
      });

      return { order: existingOrder };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException(
          'No order was found with the provided arguments.',
        );
      }

      throw new RpcException(
        'OrderService::OrderRepository::findOne unidentified error.',
      );
    }
  }

  async create(createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    try {
      const newOrder = this.orderRepository.create(createOrderDto);
      await this.orderRepository.save(newOrder);

      return { newOrder };
    } catch (error) {
      throw new RpcException(
        'OrderService::OrderRepository::create unidentified error.',
      );
    }
  }

  async update(
    requestUserId: string,
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<UpdateOrderResponse> {
    try {
      const existingOrder = await this.orderRepository.findOneOrFail({
        where: { id: orderId, userId: requestUserId, deletedAt: undefined },
      });

      // Loop through all updateItems in the updateOrderDto argument...
      updateOrderDto.itemsUpdates.forEach((updateItem) => {
        // Search, among actual items of the EXISTING order, one that matches
        // the productId of the current updateItem. And save its index.
        const matchingItemIndex = existingOrder.items.findIndex(
          (item) => item.productId === updateItem.productId,
        );

        // If EXISTS an item with the same productId as the current updateItem
        if (matchingItemIndex !== -1) {
          // 1. Change its sales price, if there is a valid newPrice value
          // in the current updateItem)
          existingOrder.items[matchingItemIndex].salesPrice =
            updateItem.newSalesPrice ??
            existingOrder.items[matchingItemIndex].salesPrice;

          // 2. Change its quantity, if there is a valid newQuantity value
          // in the current updateItem.
          existingOrder.items[matchingItemIndex].quantity =
            updateItem.newQuantity ??
            existingOrder.items[matchingItemIndex].quantity;
        }
      });

      // Remove all items whose updated quantity is equal or lesser
      // than 0 (zero)
      existingOrder.items = existingOrder.items.filter(
        (item) => item.quantity > 0,
      );

      await this.orderRepository.save(existingOrder);

      return { updatedOrder: existingOrder };
    } catch (error) {
      throw new RpcException(
        'OrderService::OrderRepository::update unidentified error.',
      );
    }
  }

  async remove(
    requestUserId: string,
    orderId: string,
  ): Promise<DeleteOrderResponse> {
    try {
      const result = await this.orderRepository.softDelete({
        id: orderId,
        userId: requestUserId,
        deletedAt: undefined,
      });

      return { success: result.affected > 0 };
    } catch (error) {
      throw new RpcException(
        'OrderService::OrderRepository::remove unidentified error.',
      );
    }
  }
}
