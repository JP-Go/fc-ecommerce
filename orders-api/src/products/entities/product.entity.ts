import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ type: 'text' })
  description: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  @Column({
    name: 'image_url',
  })
  imageUrl: string;
}
