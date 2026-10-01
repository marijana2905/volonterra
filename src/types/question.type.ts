import { Question, QuestionMessage, User } from '@prisma/types';

export type QuestionMessageWithSender = QuestionMessage & {
  senderUser: User | null;
};

export type QuestionWithMessages = Question & {
  user: User | null;
  messages: QuestionMessageWithSender[];
};
