import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields, usernameClient, adminClient } from 'better-auth/client/plugins';
import type { auth } from '@/lib/auth';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [usernameClient(), adminClient(), inferAdditionalFields<typeof auth>()],
});

export type Session = typeof authClient.$Infer.Session;

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  sendVerificationEmail,
  resetPassword,
  requestPasswordReset,
} = authClient;
