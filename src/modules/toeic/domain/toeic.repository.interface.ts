import { ToeicGroup, ToeicQuestion, ToeicResult, ToeicTest } from './toeic.entity';

export const TOEIC_TEST_REPOSITORY = Symbol('TOEIC_TEST_REPOSITORY');
export const TOEIC_RESULT_REPOSITORY = Symbol('TOEIC_RESULT_REPOSITORY');

export interface IToeicTestRepository {
  findAll(published?: boolean): Promise<ToeicTest[]>;
  findById(id: string): Promise<ToeicTest | null>;
  findGroupsWithQuestions(testId: string): Promise<(ToeicGroup & { questions: ToeicQuestion[] })[]>;
}

export interface IToeicResultRepository {
  save(result: ToeicResult): Promise<ToeicResult>;
  findByUserId(userId: string): Promise<ToeicResult[]>;
}
