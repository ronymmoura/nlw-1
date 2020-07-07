import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Item } from './Item';

@Entity()
export class Point {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    whatsapp: string;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column()
    city: string;

    @Column({ length: 2 })
    uf: string;

    @ManyToMany(type => Item)
    @JoinTable({
      name: 'point_items'
    })
    items: Item[]
}
