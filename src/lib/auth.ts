import prisma from '@/lib/prisma';
import { username, admin } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import {
  sendResetPasswordLinkEmail,
  sendVerificationLinkEmail,
} from '@/lib/nodemailer/mailerService';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
    sendResetPassword: async ({ user, url }) => {
      const { success } = await sendResetPasswordLinkEmail({
        to: user.email,
        meta: {
          description: 'Zatražen je reset lozinke za vaš nalog.',
          link: url,
          expiresMinutes: 60,
        },
      });

      if (!success) {
        throw new Error('Neuspešno slanje emaila za resetovanje lozinke');
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60, // 1 hour
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
      link.searchParams.set('callbackURL', '/auth/verify');

      const { success } = await sendVerificationLinkEmail({
        to: user.email,
        meta: {
          description: 'Molimo vas da potvrdite svoj email klikom na link ispod.',
          link: String(link),
          expiresMinutes: 60, // 1 hour
        },
      });

      if (!success) {
        throw new Error('Neuspešno slanje emaila za verifikaciju');
      }
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(';') || [];

          if (ADMIN_EMAILS.includes(user.email)) {
            return { data: { ...user, role: 'ADMIN' } };
          }

          return { data: user };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ['VOLUNTEER', 'ORGANIZER', 'ADMIN'],
      },
    },
  },
  plugins: [
    nextCookies(),
    username({
      usernameValidator: (username) => {
        if (username === 'admin') {
          return false;
        }
        return true;
      },
      minUsernameLength: 2,
      maxUsernameLength: 16,
    }),
    admin({
      defaultRole: 'VOLUNTEER',
      adminRoles: ['ADMIN'],
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
