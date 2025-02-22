import { db } from '@/db';
import { subscriptions, users } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { and, desc, eq, getTableColumns, lt, or } from 'drizzle-orm';
import { z } from 'zod';

export const subscriptionsRouter = createTRPCRouter({
   create: protectedProcedure
      .input(
         z.object({
            userId: z.string().uuid(),
         }),
      )
      .mutation(async ({ ctx, input }) => {
         const { userId } = input;

         if (userId === ctx.user.id)
            throw new TRPCError({ code: 'BAD_REQUEST' });

         const [createdSubscription] = await db
            .insert(subscriptions)
            .values({ viewerId: ctx.user.id, creatorId: userId })
            .returning();

         return createdSubscription;
      }),
   remove: protectedProcedure
      .input(
         z.object({
            userId: z.string().uuid(),
         }),
      )
      .mutation(async ({ ctx, input }) => {
         const { userId } = input;

         if (userId === ctx.user.id)
            throw new TRPCError({ code: 'BAD_REQUEST' });

         const [deeltedSubscription] = await db
            .delete(subscriptions)
            .where(
               and(
                  eq(subscriptions.viewerId, ctx.user.id),
                  eq(subscriptions.creatorId, userId),
               ),
            )
            .returning();

         return deeltedSubscription;
      }),
   getMany: protectedProcedure
      .input(
         z.object({
            cursor: z
               .object({
                  creatorId: z.string().uuid(),
                  updatedAt: z.date(),
               })
               .nullish(),
            limit: z.number().min(1).max(100),
         }),
      )
      .query(async ({ ctx, input }) => {
         const { cursor, limit } = input;
         const { id: userId } = ctx.user;

         const data = await db
            .select({
               ...getTableColumns(subscriptions),
               user: {
                  ...getTableColumns(users),
                  subscriberCount: db.$count(
                     subscriptions,
                     eq(subscriptions.creatorId, users.id),
                  ),
               },
            })
            .from(subscriptions)
            .innerJoin(users, eq(subscriptions.creatorId, users.id))
            .where(
               and(
                  eq(subscriptions.viewerId, userId),
                  cursor
                     ? or(
                          lt(subscriptions.updatedAt, cursor.updatedAt),
                          and(
                             eq(subscriptions.updatedAt, cursor.updatedAt),
                             lt(subscriptions.creatorId, cursor.creatorId),
                          ),
                       )
                     : undefined,
               ),
            )
            .orderBy(
               desc(subscriptions.updatedAt),
               desc(subscriptions.creatorId),
            )
            .limit(limit + 1);

         const hasMore = data.length > limit;
         // remove the last item cause user doesn supposed to know that we have fetched 6 items
         const items = hasMore ? data.slice(0, -1) : data;
         // Set the cursor to last item if there is more data
         const lastItem = items[items.length - 1];
         const nextCursor = hasMore
            ? {
                 creatorId: lastItem.creatorId,
                 updatedAt: lastItem.updatedAt,
              }
            : null;

         return { items, nextCursor };
      }),
});
