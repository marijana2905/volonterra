import { z } from 'zod';

export const askQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Pitanje mora imati najmanje 5 karaktera' })
    .max(500, { message: 'Pitanje ne sme imati više od 500 karaktera' }),
  email: z
    .string()
    .trim()
    .refine(value => value === '' || z.string().email().safeParse(value).success, {
      message: 'Neispravna email adresa',
    }),
});

export type AskQuestionSchemaType = z.infer<typeof askQuestionSchema>;

export const replyQuestionSchema = z.object({
  content: z
    .string()
    .min(5, { message: 'Odgovor mora imati najmanje 5 karaktera' })
    .max(1000, { message: 'Odgovor ne sme imati više od 1000 karaktera' }),
});

export type ReplyQuestionSchemaType = z.infer<typeof replyQuestionSchema>;
