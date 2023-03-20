import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from 'next-auth/providers/github';
import CredentialProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FaceBookProvider from 'next-auth/providers/facebook';
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from "@/server/db";
import { env } from '@/env.mjs'
import { type NextApiRequest, type NextApiResponse } from "next";
import { randomUUID } from "crypto";
import Cookies from "cookies";
import { decode, encode } from 'next-auth/jwt';
import { verifyPassword } from "@/utils/auth/password";
import { TRPCError } from "@trpc/server";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = requestWrapper(req, res);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await NextAuth(...data);
}

export default handler;

export function requestWrapper(
  req: NextApiRequest,
  res: NextApiResponse,
): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {
  const generateSessionToken = () => randomUUID();

  const fromDate = (time: number, date = Date.now()) =>
    new Date(date + time * 1000);

  const adapter = PrismaAdapter(prisma);

  const opts: NextAuthOptions = {
    adapter: adapter,
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
        }
        return session;
      },
      async signIn({ user }) {
        if (
          req.query.nextauth?.includes('callback') &&
          req.query.nextauth?.includes('credentials') &&
          req.method === 'POST'
        ) {
          if (user) {
            const sessionToken = generateSessionToken();
            const sessionMaxAge = 60 * 60 * 24 * 30;
            const sessionExpiry = fromDate(sessionMaxAge);

            await adapter.createSession({
              sessionToken: sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            });

            const cookies = new Cookies(req, res);

            cookies.set('next-auth.session-token', sessionToken, {
              expires: sessionExpiry,
            });

            if (!user.name) {
              return '/auth/new-user';
            }
          }
        }

        return true;
      }
    },
    jwt: {
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.query.nextauth?.includes('callback') &&
          req.query.nextauth?.includes('credentials') &&
          req.method === 'POST'
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get('next-auth.session-token');
          if (cookie) return cookie;
          else return '';
        }

        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          req.query.nextauth?.includes('callback') &&
          req.query.nextauth?.includes('credentials') &&
          req.method === 'POST'
        ) {
          return null;
        }

        return decode({ token, secret });
      },
    },
    secret: env.NEXTAUTH_SECRET,
    debug: true,
    providers: [
      FaceBookProvider({
        clientId: env.FACEBOOK_CLIENT_ID,
        clientSecret: env.FACEBOOK_CLIENT_SECRET,
      }),
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
      GithubProvider({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      }),
      CredentialProvider({
        name: 'CredentialProvider',
        credentials: {
          email: { label: 'Username', type: 'email', email: 'james@example.com' },
          password: { lable: 'Password', type: 'password', placeholder: '••••••••' },
        },
        async authorize(credentials) {
          try {
            const user = await prisma.user.findUnique({
              where: {
                email: credentials?.email,
              },
              select: {
                id: true,
                name: true,
                password: true,
                image: true,
              },
            });

            if (!user) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Invalid credentials given',
              });
            }

            if (user.password === null || !credentials?.password) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Incorrect crendentials given'
              });
            }

            const isCorrectPassword = await verifyPassword(
              credentials?.password,
              user?.password
            );

            if (!isCorrectPassword) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Incorrect crendentials given'
              })
            }

            return {
              id: user.id,
              name: user.name,
              image: user.image,
            }
          } catch (err) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Something went wrong, please try again',
              cause: err,
            });
          }
        }
      })
    ],
    pages: {
      signIn: '/auth/login',
      signOut: '/auth/logout',
      error: '/auth/error',
      newUser: '/auth/new-user',
    },
  };

  return [req, res, opts];
}
