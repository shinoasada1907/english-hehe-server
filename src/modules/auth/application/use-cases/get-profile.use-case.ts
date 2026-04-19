import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/application/base.use-case';
import { IAuthRepository, AUTH_REPOSITORY } from '../../domain/auth.repository.interface';

export interface GetProfileOutput {
  id: string;
  email: string;
  fullName: string;
  role: string;
  currentLevel: string;
  streakDays: number;
  totalXp: number;
  dailyGoal: number;
  isActive: boolean;
}

@Injectable()
export class GetProfileUseCase implements IUseCase<string, GetProfileOutput> {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
  ) {}

  async execute(userId: string): Promise<GetProfileOutput> {
    const user = await this.authRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      email: user.email.toString(),
      fullName: user.fullName,
      role: user.role,
      currentLevel: user.currentLevel,
      streakDays: user.streakDays,
      totalXp: user.totalXp,
      dailyGoal: user.dailyGoal,
      isActive: user.isActive,
    };
  }
}
