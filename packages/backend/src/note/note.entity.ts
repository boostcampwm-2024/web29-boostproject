import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Note {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column()
  userId: string;

  @Column()
  urlPath: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  content: string;
}
