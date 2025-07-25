import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // @Column({
  //   type: 'integer',
  //   nullable: true,
  //    default: null,
  // })
  // age: number | null;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  refreshToken: string | null;
}
