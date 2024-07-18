/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { ProductService } from './product.service';
import {
  ListProductsRequest,
  ListProductsResponse,
  GetProductRequest,
  GetProductResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  DeleteProductRequest,
  DeleteProductResponse,
} from './proto/product/products';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'ListProducts')
  async listProducts(
    data: ListProductsRequest,
    metadata?: Metadata,
    call?: ServerUnaryCall<ListProductsRequest, ListProductsResponse>,
  ): Promise<ListProductsResponse> {
    try {
      const response = await this.productService.findMany(
        data.page,
        data.limit,
      );

      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('ProductService', 'GetProduct')
  async getProduct(
    data: GetProductRequest,
    metadata?: Metadata,
    call?: ServerUnaryCall<GetProductRequest, GetProductResponse>,
  ): Promise<GetProductResponse> {
    try {
      const response = await this.productService.findOne(data.productId);

      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('ProductService', 'CreateProduct')
  async createProduct(
    data: CreateProductRequest,
    metadata?: Metadata,
    call?: ServerUnaryCall<CreateProductRequest, CreateProductResponse>,
  ): Promise<CreateProductResponse> {
    try {
      const createProductDto: CreateProductDto = Object.assign(
        new CreateProductDto(),
        data,
      );
      const response = this.productService.create(createProductDto);

      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('ProductService', 'UpdateProduct')
  async updateProduct(
    data: UpdateProductRequest,
    metadata?: Metadata,
    call?: ServerUnaryCall<UpdateProductRequest, UpdateProductResponse>,
  ): Promise<UpdateProductResponse> {
    try {
      const updateProductDto: UpdateProductDto = Object.assign(
        new UpdateProductDto(),
        {
          newName: data?.newName || undefined,
          newDescription: data?.newDescription || undefined,
          newPrice: data?.newPrice || undefined,
          newStock: data?.newStock || undefined,
        },
      );

      const response = await this.productService.update(
        data.productId,
        updateProductDto,
      );

      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('ProductService', 'DeleteProduct')
  async deleteProduct(
    data: DeleteProductRequest,
    metadata?: Metadata,
    call?: ServerUnaryCall<DeleteProductRequest, DeleteProductResponse>,
  ): Promise<DeleteProductResponse> {
    try {
      const response = await this.productService.remove(data.productId);

      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
