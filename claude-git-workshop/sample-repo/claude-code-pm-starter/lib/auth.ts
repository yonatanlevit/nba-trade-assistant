// lib/auth.ts
//
// NOTE FOR FUTURE READERS (and Claude): this file is messy.
// Auth logic, user lookup, and session helpers grew tangled here.
// A refactor is planned but not started. Adding SSO requires touching this carefully.
// Don't make it worse without a plan.

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

// --- Session helpers ---
// (these probably belong in a separate file but they live here for historical reasons)

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  currencyCode: string;
};

export async function getUserByEmail(email: string): Promise<SessionUser | null> {
  // also called from /api/invoices to look up the invoice owner — see notes there
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    currencyCode: user.currencyCode,
  };
}

export async function verifyPassword(email: string, password: string): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  // duplicates the shape from getUserByEmail — these should be merged
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    currencyCode: user.currencyCode,
  };
}

// --- NextAuth config ---
// providers list is intentionally short. Adding Google/Microsoft SSO means:
//   1. install @next-auth/prisma-adapter (we don't have it yet)
//   2. add Account model to prisma/schema.prisma
//   3. add the providers below
//   4. re-think how the credentials path coexists with OAuth
//   5. update session callback (OAuth users won't go through verifyPassword)
//   6. update the login page UI

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await verifyPassword(credentials.email, credentials.password);
        if (!user) return null;
        return user;
      },
    }),
    // TODO: GoogleProvider, MicrosoftProvider — see notes at top of file
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // 'user' shape here matches SessionUser — but next-auth's User type doesn't.
        // We stuff currencyCode into token manually. This will break for OAuth users
        // because OAuth doesn't go through verifyPassword. See refactor notes.
        const u = user as unknown as SessionUser;
        token.userId = u.id;
        token.currencyCode = u.currencyCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; currencyCode?: string }).id = token.userId as string;
        (session.user as { id?: string; currencyCode?: string }).currencyCode = token.currencyCode as string;
      }
      return session;
    },
  },
};

// --- Convenience for server components ---
// also imported by /api routes — be careful not to create circular deps
export async function requireUser() {
  // imported at call sites with: const user = await requireUser();
  // throws if no session — caller should handle
  const { getServerSession } = await import("next-auth/next");
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as SessionUser;
}
