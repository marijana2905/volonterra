import { z } from 'zod';

export const blogFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Naslov mora imati najmanje 5 karaktera' })
    .max(100, { message: 'Naslov ne sme imati više od 100 karaktera' }),
  content: z.string().min(20, { message: 'Sadržaj bloga mora imati najmanje 20 karaktera' }),
  imageUrl: z.string().nullable(),
  keywords: z
    .array(z.string())
    .min(1, { message: 'Mora imati makar 1 ključnu reč' })
    .max(10, { message: 'Maksimalno 10 ključnih reči' }),
});

export type BlogFormSchemaType = z.infer<typeof blogFormSchema>;

// Blog comment schema
export const commentFormSchema = z.object({
  content: z.string().min(5, 'Komentar mora imati makar 5 karaktera'),
});

export type CommentFormSchemaType = z.infer<typeof commentFormSchema>;
