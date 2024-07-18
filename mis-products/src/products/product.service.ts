import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  CreateProductResponse,
  DeleteProductResponse,
  GetProductResponse,
  ListProductsResponse,
  UpdateProductResponse,
} from './proto/product/products';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async findMany(
    page: number = 1,
    limit: number = 10,
  ): Promise<ListProductsResponse> {
    if (!page || isNaN(page) || page < 1) {
      throw new RpcException('Page must be a positive integer.');
    }

    if (!limit || isNaN(limit) || limit < 1) {
      throw new RpcException('Limit must be a positive integer');
    }

    const offset = (page - 1) * limit;

    try {
      const [products, totalItems] = await this.productRepository.findAndCount({
        where: { deleted: false },
        order: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      });

      const pageItems = products.length;
      const hasPreviousPage = page > 1;
      const previousPage = hasPreviousPage ? page - 1 : undefined;
      const hasNextPage = offset + pageItems < totalItems;
      const nextPage = hasNextPage ? page + 1 : undefined;

      return {
        products,
        currentPage: page,
        pageItems,
        totalItems,
        hasPreviousPage,
        previousPage,
        hasNextPage,
        nextPage,
      } as ListProductsResponse;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findOne(productId: string): Promise<GetProductResponse> {
    try {
      const product = await this.productRepository.findOne({
        where: { deleted: false, id: productId },
      });

      return {
        product,
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<CreateProductResponse> {
    try {
      const newProduct = await this.productRepository.create(createProductDto);

      await this.productRepository.save(newProduct);

      return { newProduct };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async update(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<UpdateProductResponse> {
    try {
      const existingProduct = await this.productRepository.findOneOrFail({
        where: { deleted: false, id: productId },
      });

      existingProduct.name = updateProductDto?.newName ?? existingProduct.name;
      existingProduct.description =
        updateProductDto?.newDescription ?? existingProduct.description;
      existingProduct.price =
        updateProductDto?.newPrice ?? existingProduct.price;
      existingProduct.stock =
        updateProductDto?.newStock ?? existingProduct.stock;

      await this.productRepository.save(existingProduct);

      return { updatedProduct: existingProduct };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async remove(productId: string): Promise<DeleteProductResponse> {
    try {
      const result = await this.productRepository.softDelete({
        deleted: false,
        id: productId,
      });

      const success = result.affected === 1;

      if (success) {
        const deletedProduct = await this.productRepository.findOne({
          where: { id: productId },
        });

        deletedProduct.deleted = true;

        await this.productRepository.save(deletedProduct);
      }

      return { success };
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
