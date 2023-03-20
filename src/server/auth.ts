import { type NextApiRequest, type NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import { requestWrapper } from '@/pages/api/auth/[...nextauth]';

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async (ctx: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  return await getServerSession(...requestWrapper(ctx.req, ctx.res));
};
