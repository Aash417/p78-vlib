import { categoriesRouter } from '@/modules/categories/server/procedure';
import { commentsRouter } from '@/modules/comments/server/procedure';
import { studioRouter } from '@/modules/studio/server/procedures';
import { subscriptionsRouter } from '@/modules/subscriptions/server/procedure';
import { videoReactionsRouter } from '@/modules/video-reactions/server/procedure';
import { videoViewsRouter } from '@/modules/video-views/server/procedure';
import { videosRouter } from '@/modules/videos/server/procedures';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
   studio: studioRouter,
   videos: videosRouter,
   categories: categoriesRouter,
   videoViews: videoViewsRouter,
   videoReactions: videoReactionsRouter,
   subscriptions: subscriptionsRouter,
   comments: commentsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
