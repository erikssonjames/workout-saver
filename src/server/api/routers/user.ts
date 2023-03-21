import { z } from 'zod';
import { prisma } from '@/server/db';
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from '@/server/api/trpc';
import { hashPassword } from '@/utils/auth/password';
import { TRPCError } from '@trpc/server';

export const userRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .output(
      z.object({
        userId: z.string()
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { email, password } = input;

        const userExists = await prisma.user.findFirst({ where: { email } });

        if (userExists) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'A user with this email is already registered',
          });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
          data: {
            email: email,
            password: hashedPassword,
          },
          select: {
            id: true,
          }
        });

        return {
          userId: user.id,
        }
      } catch (e) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          cause: e,
        })
      }
    })
})
