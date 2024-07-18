import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'decimal',
    precision: 9,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
    precision: 9,
    scale: 4,
  })
  stock: number;

  @Column({ select: false, nullable: false, default: false })
  deleted: boolean;

  @CreateDateColumn({
    select: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    select: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    select: false,
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  deletedAt?: Date;
}
