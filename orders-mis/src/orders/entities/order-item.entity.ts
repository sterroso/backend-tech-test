import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity()
@Unique('UN_order_item_order_id_product_id', ['orderId', 'productId'])
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  productId: string;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  orderId: string;

  @Column({
    type: 'decimal',
    precision: 9,
    scale: 2,
  })
  salesPrice: number;

  @Column({
    type: 'decimal',
    precision: 9,
    scale: 4,
  })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  subtotal: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    default: null,
    select: false,
  })
  deletedAt?: Date;
}
