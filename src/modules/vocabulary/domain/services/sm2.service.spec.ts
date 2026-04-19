import { Sm2Service } from './sm2.service';

describe('Sm2Service', () => {
  describe('quality < 3 (failed recall)', () => {
    it('should reset repetitions and set interval to 1', () => {
      const result = Sm2Service.calculate({ easeFactor: 2.5, intervalDays: 10, repetitions: 5, quality: 0 });
      expect(result.repetitions).toBe(0);
      expect(result.intervalDays).toBe(1);
      expect(result.status).toBe('learning');
    });

    it('should still update easeFactor even on failure', () => {
      const result = Sm2Service.calculate({ easeFactor: 2.5, intervalDays: 1, repetitions: 0, quality: 2 });
      expect(result.easeFactor).toBeLessThan(2.5);
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });
  });

  describe('quality >= 3 (successful recall)', () => {
    it('quality=3: first repetition → interval=1, repetitions=1', () => {
      const result = Sm2Service.calculate({ easeFactor: 2.5, intervalDays: 1, repetitions: 0, quality: 3 });
      expect(result.intervalDays).toBe(1);
      expect(result.repetitions).toBe(1);
      expect(result.status).toBe('review');
    });

    it('quality=3: second repetition → interval=6, repetitions=2', () => {
      const result = Sm2Service.calculate({ easeFactor: 2.5, intervalDays: 1, repetitions: 1, quality: 3 });
      expect(result.intervalDays).toBe(6);
      expect(result.repetitions).toBe(2);
    });

    it('quality=5: third repetition → interval=round(6*easeFactor)', () => {
      const result = Sm2Service.calculate({ easeFactor: 2.5, intervalDays: 6, repetitions: 2, quality: 5 });
      expect(result.intervalDays).toBe(15); // round(6 * 2.5)
      expect(result.repetitions).toBe(3);
    });

    it('quality=5: easeFactor should increase', () => {
      const result = Sm2Service.calculate({ easeFactor: 2.5, intervalDays: 1, repetitions: 0, quality: 5 });
      expect(result.easeFactor).toBeGreaterThan(2.5);
    });

    it('easeFactor should never go below 1.3', () => {
      const result = Sm2Service.calculate({ easeFactor: 1.3, intervalDays: 1, repetitions: 0, quality: 3 });
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });
  });

  describe('mastered status', () => {
    it('should set status=mastered when intervalDays >= 21', () => {
      const result = Sm2Service.calculate({ easeFactor: 2.5, intervalDays: 10, repetitions: 3, quality: 5 });
      expect(result.intervalDays).toBe(25); // round(10 * 2.5)
      expect(result.status).toBe('mastered');
    });
  });

  describe('nextReviewAt', () => {
    it('should be in the future', () => {
      const before = Date.now();
      const result = Sm2Service.calculate({ easeFactor: 2.5, intervalDays: 1, repetitions: 0, quality: 4 });
      expect(result.nextReviewAt.getTime()).toBeGreaterThan(before);
    });
  });
});
