import { z } from 'zod';

const requirements = [
  { regex: /.{6,}/, text: 'Najmanje 6 karaktera' },
  { regex: /[0-9]/, text: 'Najmanje 1 broj' },
  { regex: /[a-z]/, text: 'Najmanje 1 malo slovo' },
  { regex: /[A-Z]/, text: 'Najmanje 1 veliko slovo' },
];

export const changePasswordSchema = z.object({
  currentPassword: z.string().nonempty({
    message: 'Trenutna lozinka je obavezno polje',
  }),
  password: z
    .string()
    .nonempty({
      message: 'Lozinka je obavezno polje',
    })
    .min(6, {
      message: 'Lozinka mora imati najmanje 6 karaktera',
    })
    .refine(val => requirements.every(r => r.regex.test(val)), {
      message: requirements.map(r => r.text).join(', '),
    }),
});

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
