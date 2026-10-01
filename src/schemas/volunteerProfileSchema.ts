import z from 'zod';

export const volunteerProfileSchema = z.object({
  bio: z
    .string()
    .max(2000, { message: 'Biografija ne sme imati više od 2000 karaktera' })
    .optional(),
  phone: z
    .string()
    .max(15, { message: 'Broj telefona ne sme imati više od 15 karaktera' })
    .optional(),
  facebookLink: z
    .string()
    .max(255, { message: 'Link ne sme imati više od 255 karaktera' })
    .optional(),
  instagramLink: z
    .string()
    .max(255, { message: 'Link ne sme imati više od 255 karaktera' })
    .optional(),
  xLink: z.string().max(255, { message: 'Link ne sme imati više od 255 karaktera' }).optional(),
});

export type VolunteerProfileSchemaType = z.infer<typeof volunteerProfileSchema>;
