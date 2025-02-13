'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import CommentForm from '@/modules/comments/ui/components/comment-form';
import CommentItem from '@/modules/comments/ui/components/comment-item';
import { trpc } from '@/trpc/client';
import { Loader2Icon } from 'lucide-react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
   videoId: string;
};

export default function CommentsSection({ videoId }: Props) {
   return (
      <Suspense fallback={<CommentsSectionSkeleton />}>
         <ErrorBoundary fallback={<p>error...</p>}>
            <CommentsSectionSuspense videoId={videoId} />
         </ErrorBoundary>
      </Suspense>
   );
}

function CommentsSectionSkeleton() {
   return (
      <div className="mt-6 flex justify-center items-center">
         <Loader2Icon className="text-muted-foreground size-7 animate-spin " />
      </div>
   );
}

function CommentsSectionSuspense({ videoId }: Props) {
   const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
      {
         videoId,
         limit: DEFAULT_LIMIT,
      },
      { getNextPageParam: (lastpage) => lastpage.nextCursor },
   );

   return (
      <div className="mt-6">
         <div className="flex flex-col gap-6">
            <h1 className="text-xl font-bold">
               {comments.pages[0].totalCount} comments
            </h1>
            <CommentForm videoId={videoId} />
         </div>

         <div className="flex flex-col gap-4 mt-2">
            {comments.pages
               .flatMap((page) => page.items)
               .map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
               ))}

            <InfiniteScroll
               isManual
               hasNextPage={query.hasNextPage}
               isFetchingNextPage={query.isFetchingNextPage}
               fetchNextPage={query.fetchNextPage}
            />
         </div>
      </div>
   );
}
