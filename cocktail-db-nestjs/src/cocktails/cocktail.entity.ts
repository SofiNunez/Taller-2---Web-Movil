import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Cocktail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  alcoholic: string;

  @Column({ nullable: true })
  glass: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ nullable: true })
  thumbnail: string;
}
