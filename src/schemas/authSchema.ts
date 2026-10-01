import { z } from 'zod';

// Authentication schemas
const requirements = [
  { regex: /.{6,}/, text: 'Najmanje 6 karaktera' },
  { regex: /[0-9]/, text: 'Najmanje 1 broj' },
  { regex: /[a-z]/, text: 'Najmanje 1 malo slovo' },
  { regex: /[A-Z]/, text: 'Najmanje 1 veliko slovo' },
];

export const registerFormSchema = z.object({
  userType: z.enum(['volunteer', 'organization'], {
    required_error: 'Tip korisnika je obavezan',
  }),
  // name - kad je tip korisnika volonter onda je ime i prezime, ako je tip korisnika organizacija onda je naziv organizacije
  name: z.string().min(2, {
    message: 'Ovo polje je obavezno',
  }),
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
  email: z
    .string()
    .nonempty({
      message: 'Email je obavezno polje',
    })
    .email({
      message: 'Unesite ispravnu email adresu',
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

export type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;

export const loginFormSchema = z.object({
  email: z
    .string()
    .nonempty({
      message: 'Email je obavezno polje',
    })
    .email({
      message: 'Unesite ispravnu email adresu',
    }),
  password: z.string().nonempty({
    message: 'Lozinka je obavezno polje',
  }),
});

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

export const sendVerificationEmailFormSchema = z.object({
  email: z
    .string()
    .nonempty({
      message: 'Email je obavezno polje',
    })
    .email({
      message: 'Unesite ispravnu email adresu',
    }),
});

export type SendVerificationEmailFormSchemaType = z.infer<typeof sendVerificationEmailFormSchema>;

export const forgotPasswordForm = z.object({
  email: z
    .string()
    .nonempty({
      message: 'Email je obavezno polje',
    })
    .email({
      message: 'Unesite ispravnu email adresu',
    }),
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordForm>;

export const resetPasswordForm = z.object({
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

export type ResetPasswordFormType = z.infer<typeof resetPasswordForm>;

// Edit Profile Description Form Schema
export const editDescriptionFormSchema = z.object({
  content: z.string().optional(),
});

export type EditDescriptionFormSchemaType = z.infer<typeof editDescriptionFormSchema>;
