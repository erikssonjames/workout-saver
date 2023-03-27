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
    }),
  newUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        age: z.number(),
        weight: z.number(),
        weightQuantifier: z.string(),
        height: z.number(),
        heigthQuantifier: z.string(),
        gymFrequency: z.string(),
        workoutType: z.string(),
        goals: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const {
          name,
          age,
          weight,
          weightQuantifier,
          height,
          heigthQuantifier,
          gymFrequency,
          workoutType,
          goals,
        } = input;

        if(!ctx.session.user) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User not logged in',
          });
        }

        const gainMuscle = goals.includes("Gain muscle");
        const loseFat = goals.includes("Lose fat");
        const gainStrength = goals.includes("Gain strength");
        const improveHealth = goals.includes("Improve health");

        const userTest = await prisma.user.findUnique({
          where: {
            id: ctx.session.user.id,
          },
        });

        console.log("User: ", userTest);

        const userInfo = await prisma.userInfo.findFirst({
          where: {
            userId: ctx.session.user.id,
          },
        });

        if (userInfo) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User already has a profile',
          });
        }

        const user = await prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            userInfo: {
              create: {
                name,
                age,
                weight,
                weightQuantifier,
                height,
                heigthQuantifier,
                gymInfo: {
                  create: {
                    gymFrequency,
                    workoutType,
                    gainMuscle,
                    loseFat,
                    gainStrength,
                    improveHealth,
                  },
                },
              }
            }
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
    }),
})
