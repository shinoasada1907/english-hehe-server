import { ProgressStatus } from '../user-vocabulary-progress.entity';

export interface Sm2Input {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  quality: number; // 0–5
}

export interface Sm2Result {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: Date;
  status: ProgressStatus;
}

export class Sm2Service {
  static calculate(input: Sm2Input): Sm2Result {
    let { easeFactor, intervalDays, repetitions } = input;
    const { quality } = input;

    if (quality < 3) {
      repetitions = 0;
      intervalDays = 1;
    } else {
      if (repetitions === 0) {
        intervalDays = 1;
      } else if (repetitions === 1) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round(intervalDays * easeFactor);
      }
      repetitions++;
    }

    easeFactor = easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    easeFactor = Math.max(1.3, Math.round(easeFactor * 100) / 100);

    const nextReviewAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);

    let status: ProgressStatus;
    if (repetitions === 0) {
      status = 'learning';
    } else if (intervalDays >= 21) {
      status = 'mastered';
    } else {
      status = 'review';
    }

    return { easeFactor, intervalDays, repetitions, nextReviewAt, status };
  }
}
