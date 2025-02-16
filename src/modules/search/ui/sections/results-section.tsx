'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoRowCard from '@/modules/videos/ui/components/video-row-card';
import VideoGridCard from '@/modules/videos/ui/components/view-grid-card';
import { trpc } from '@/trpc/client';

type Props = {
   query: string | undefined;
   categoryId: string | undefined;
};

export default function ResultSection({ query, categoryId }: Props) {
   const isMobile = useIsMobile();
   const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
      {
         query,
         categoryId,
         limit: DEFAULT_LIMIT,
      },
      {
         getNextPageParam: (lastpage) => lastpage.nextCursor,
      },
   );

   return (
      <>
         {isMobile ? (
            <div className="flex flex-col gap-4 gap-y-10">
               {results.pages
                  .flatMap((page) => page.items)
                  .map((video) => (
                     <VideoGridCard key={video.id} data={video} />
                  ))}
            </div>
         ) : (
            <div className="flex flex-col gap-4">
               {results.pages
                  .flatMap((page) => page.items)
                  .map((video) => (
                     <VideoRowCard key={video.id} data={video} />
                  ))}
            </div>
         )}

         <InfiniteScroll
            hasNextPage={resultQuery.hasNextPage}
            isFetchingNextPage={resultQuery.isFetchingNextPage}
            fetchNextPage={resultQuery.fetchNextPage}
         />
      </>
   );
}
