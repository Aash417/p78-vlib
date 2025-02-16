'use client';

import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import VideoRowCard, {
   VideoRowCardSkeleton,
} from '../components/video-row-card';
import VideoGridCard, {
   VideoGridCardSkeleton,
} from '../components/view-grid-card';
import InfiniteScroll from '@/components/infinite-scroll';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
   videoId: string;
   isManual?: boolean;
};

export default function SuggestionSection({ videoId, isManual }: Props) {
   return (
      <Suspense fallback={<SuggestionSectionSkeleton />}>
         <ErrorBoundary fallback={<p>error..</p>}>
            <SuggestionSectionSuspense videoId={videoId} isManual={isManual} />
         </ErrorBoundary>
      </Suspense>
   );
}

function SuggestionSectionSkeleton() {
   return (
      <>
         <div className="hidden md:block space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
               <VideoRowCardSkeleton key={index} size="compact" />
            ))}
         </div>
         <div className="block md:hidden space-y-10">
            {Array.from({ length: 8 }).map((_, index) => (
               <VideoGridCardSkeleton key={index} />
            ))}
         </div>
      </>
   );
}

function SuggestionSectionSuspense({ videoId, isManual }: Props) {
   const [suggestions, query] =
      trpc.suggestions.getMany.useSuspenseInfiniteQuery(
         {
            videoId,
            limit: DEFAULT_LIMIT,
         },
         {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
         },
      );

   return (
      <>
         <div className="hidden md:block space-y-3">
            {suggestions.pages.flatMap((page) =>
               page.items.map((video) => (
                  <VideoRowCard key={video.id} size="compact" data={video} />
               )),
            )}
         </div>

         <div className="block md:hidden space-y-10">
            {suggestions.pages.flatMap((page) =>
               page.items.map((video) => (
                  <VideoGridCard key={video.id} data={video} />
               )),
            )}
         </div>
         <InfiniteScroll
            isManual={isManual}
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
         />
      </>
   );
}
