import { Question } from '../../domain/question.entity';
import { QuestionTypeormEntity } from '../entities/question.typeorm.entity';

export class QuestionMapper {
  static toDomain(orm: QuestionTypeormEntity): Question {
    const q = new Question();
    q.id = orm.id;
    q.testId = orm.testId;
    q.content = orm.content;
    q.choices = orm.choices;
    q.correctAnswer = orm.correctAnswer;
    q.explanation = orm.explanation;
    q.orderIndex = orm.orderIndex;
    return q;
  }
}
