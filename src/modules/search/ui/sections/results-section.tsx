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

type Props = {
   query: string | undefined;
   categoryId: string | undefined;
};

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function ResultSection(props: Props) {
   return (
      <Suspense
         key={`${props.query}-${props.categoryId}`}
         fallback={<ResultSectionSkeleton />}
      >
         <ErrorBoundary fallback={<p>error...</p>}>
            <ResultSectionSuspense {...props} />
         </ErrorBoundary>
      </Suspense>
   );
}

function ResultSectionSkeleton() {
   return (
      <div>
         <div className="hidden flex-col gap-4 md:flex">
            {Array.from({ length: 5 }).map((_, index) => (
               <VideoRowCardSkeleton key={index} />
            ))}
         </div>

         <div className="flex flex-col gap-4 p-4 gap-y-10 pt-6 md:hidden">
            {Array.from({ length: 5 }).map((_, index) => (
               <VideoGridCardSkeleton key={index} />
            ))}
         </div>
      </div>
   );
}

function ResultSectionSuspense({ query, categoryId }: Props) {
   const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
      {
         query,
         categoryId,
         limit: DEFAULT_LIMIT,
      },
      {
         getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
   );

   return (
      <>
         <div className="flex flex-col gap-4 gap-y-10 md:hidden">
            {results.pages
               .flatMap((page) => page.items)
               .map((video) => (
                  <VideoGridCard key={video.id} data={video} />
               ))}
         </div>
         <div className="hidden flex-col gap-4 md:flex">
            {results.pages
               .flatMap((page) => page.items)
               .map((video) => (
                  <VideoRowCard key={video.id} data={video} />
               ))}
         </div>

         <InfiniteScroll
            hasNextPage={resultQuery.hasNextPage}
            isFetchingNextPage={resultQuery.isFetchingNextPage}
            fetchNextPage={resultQuery.fetchNextPage}
         />
      </>
   );
}
