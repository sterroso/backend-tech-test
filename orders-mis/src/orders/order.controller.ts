/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import {
  ListOrdersRequest,
  ListOrdersResponse,
  GetOrderRequest,
  GetOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderRequest,
  UpdateOrderResponse,
  DeleteOrderRequest,
  DeleteOrderResponse,
} from './proto/orders/orders';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod('OrderService', 'ListOrders')
  async listOrders(
    data: ListOrdersRequest,
    metadata?: Metadata,
    call?: ServerUnaryCall<ListOrdersRequest, ListOrdersResponse>,
  ): Promise<ListOrdersResponse> {
    try {
      const response = await this.orderService.findMany(
        data.requestUserId,
        data.page,
        data.limit,
      );

      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('OrderService', 'GetOrder')
  async getOrder(
    data: GetOrderRequest,
    metadata?: Metadata,
    call?: ServerUnaryCall<CreateOrderRequest, CreateOrderResponse>,
  ): Promise<GetOrderResponse> {
    try {
      const response = await this.orderService.findOne(
        data.requestUserId,
        data.orderId,
      );

      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('OrderService', 'CreateOrder')
  async createOrder(
    data: CreateOrderRequest,
    metadata?: Metadata,
    call?: ServerUnaryCall<CreateOrderRequest, CreateOrderResponse>,
  ): Promise<CreateOrderResponse> {
    try {
      const createOrderDto = Object.assign(new CreateOrderDto(), {
        userId: data.requestUserId,
        items: data.orderItems,
      });
      const response = await this.orderService.create(createOrderDto);

      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('OrderService', 'UpdateOrder')
  async updateOrder(
    data: UpdateOrderRequest,
    metadata?: Metadata,
    call?: ServerUnaryCall<CreateOrderRequest, CreateOrderResponse>,
  ): Promise<UpdateOrderResponse> {
    try {
      const updateOrderDto = Object.assign(new UpdateOrderDto(), {
        itemsUpdates: data.itemsUpdates,
      });
      const response = await this.orderService.update(
        data.requestUserId,
        data.orderId,
        updateOrderDto,
      );

      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('OrderService', 'DeleteOrder')
  async deleteOrder(
    data: DeleteOrderRequest,
    metadata?: Metadata,
    call?: ServerUnaryCall<CreateOrderRequest, CreateOrderResponse>,
  ): Promise<DeleteOrderResponse> {
    try {
      const response = await this.orderService.remove(
        data.requestUserId,
        data.orderId,
      );

      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
