'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import VideoRowCard, {
   VideoRowCardSkeleton,
} from '@/modules/videos/ui/components/video-row-card';
import VideoGridCard, {
   VideoGridCardSkeleton,
} from '@/modules/videos/ui/components/view-grid-card';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function LikedVideoSection() {
   return (
      <Suspense fallback={<LikedVideoSectionSkeleton />}>
         <ErrorBoundary fallback={<p>error...</p>}>
            <LikedVideoSectionSuspense />
         </ErrorBoundary>
      </Suspense>
   );
}

function LikedVideoSectionSkeleton() {
   return (
      <div>
         <div className="flex flex-col gap-4 gap-y-10 md:hidden">
            {Array.from({ length: 18 }).map((_, index) => (
               <VideoGridCardSkeleton key={index + 1} />
            ))}
         </div>

         <div className="hidden flex-col gap-4 md:flex">
            {Array.from({ length: 18 }).map((_, index) => (
               <VideoRowCardSkeleton key={index + 1} size="compact" />
            ))}
         </div>
      </div>
   );
}

function LikedVideoSectionSuspense() {
   const [videos, query] = trpc.playlists.getLiked.useSuspenseInfiniteQuery(
      { limit: DEFAULT_LIMIT },
      {
         getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
   );

   return (
      <>
         <div className="flex flex-col gap-4 gap-y-10 md:hidden">
            {videos.pages
               .flatMap((page) => page.items)
               .map((video) => (
                  <VideoGridCard key={video.id} data={video} />
               ))}
         </div>

         <div className="hidden flex-col gap-4 md:flex">
            {videos.pages
               .flatMap((page) => page.items)
               .map((video) => (
                  <VideoRowCard key={video.id} data={video} size="compact" />
               ))}
         </div>

         <InfiniteScroll
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
         />
      </>
   );
}
