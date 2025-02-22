'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import VideoGridCard, {
   VideoGridCardSkeleton,
} from '@/modules/videos/ui/components/view-grid-card';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
   userId: string;
};

export default function VideoSection({ userId }: Props) {
   return (
      <Suspense fallback={<VideoSectionSkeleton />}>
         <ErrorBoundary fallback={<p>error...</p>}>
            <VideoSectionSuspense userId={userId} />
         </ErrorBoundary>
      </Suspense>
   );
}

function VideoSectionSkeleton() {
   return (
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
         {Array.from({ length: 18 }).map((_, index) => (
            <VideoGridCardSkeleton key={index + 1} />
         ))}
      </div>
   );
}

function VideoSectionSuspense({ userId }: Props) {
   const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
      { userId, limit: DEFAULT_LIMIT },
      {
         getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
   );

   return (
      <div>
         <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            {videos.pages
               .flatMap((page) => page.items)
               .map((video) => (
                  <VideoGridCard key={video.id} data={video} />
               ))}
         </div>

         <InfiniteScroll
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
         />
      </div>
   );
}
