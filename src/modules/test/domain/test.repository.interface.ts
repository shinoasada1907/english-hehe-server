import { Test } from './test.entity';
import { Question } from './question.entity';
import { TestResult } from './test-result.entity';

export const TEST_REPOSITORY = Symbol('ITestRepository');
export const QUESTION_REPOSITORY = Symbol('IQuestionRepository');
export const TEST_RESULT_REPOSITORY = Symbol('ITestResultRepository');

export interface TestFilter {
  level?: string;
  category?: string;
}

export interface ITestRepository {
  findAll(filter: TestFilter): Promise<Test[]>;
  findById(id: string): Promise<Test | null>;
}

export interface IQuestionRepository {
  findByTestId(testId: string): Promise<Question[]>;
}

export interface ITestResultRepository {
  save(result: TestResult): Promise<TestResult>;
  findByUser(userId: string): Promise<TestResult[]>;
}
