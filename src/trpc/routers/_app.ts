import { categoriesRouter } from '@/modules/categories/server/procedure';
import { commentReactionsRouter } from '@/modules/comment-reactions/server/procedure';
import { commentsRouter } from '@/modules/comments/server/procedure';
import { searchRouter } from '@/modules/search/server/procedures';
import { studioRouter } from '@/modules/studio/server/procedures';
import { subscriptionsRouter } from '@/modules/subscriptions/server/procedure';
import { suggestionsRouter } from '@/modules/suggestions/server/procedures';
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
   commentReactions: commentReactionsRouter,
   suggestions: suggestionsRouter,
   search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
