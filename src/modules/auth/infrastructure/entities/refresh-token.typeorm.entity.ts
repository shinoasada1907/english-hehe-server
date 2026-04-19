import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTypeormEntity } from '@database/base.typeorm.entity';
import { UserTypeormEntity } from './user.typeorm.entity';

@Entity('refresh_tokens')
export class RefreshTokenTypeormEntity extends BaseTypeormEntity {
  @Index()
  @Column({ name: 'user_id' })
  userId!: string;

  @Index({ unique: true })
  @Column({ name: 'token_hash', unique: true })
  tokenHash!: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @ManyToOne(() => UserTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserTypeormEntity;
}
