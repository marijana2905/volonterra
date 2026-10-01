import { z } from 'zod';

export const accountSchema = z.object({
  name: z
    .string()
    .min(2, 'Ime mora imati najmanje 2 karaktera')
    .max(100, 'Ime ne sme imati više od 100 karaktera'),
  username: z
    .string()
    .min(2, {
      message: 'Ovo polje je obavezno',
    })
    .refine(val => !/\s/.test(val), {
      message: 'Korisničko ime ne sme sadržati razmake',
    })
    .refine(val => /^[a-zA-Z0-9_]+$/.test(val), {
      message: 'Korisničko ime sme sadržati samo mala slova, velika slova, cifre i donju crtu',
    }),
});

export type AccountSchemaType = z.infer<typeof accountSchema>;
