'use client';

import CommentForm from '@/modules/comments/ui/components/comment-form';
import CommentItem from '@/modules/comments/ui/components/comment-item';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
   videoId: string;
};

export default function CommentsSection({ videoId }: Props) {
   return (
      <Suspense fallback={<p>loading</p>}>
         <ErrorBoundary fallback={<p>error...</p>}>
            <CommentsSectionSuspense videoId={videoId} />
         </ErrorBoundary>
      </Suspense>
   );
}

function CommentsSectionSuspense({ videoId }: Props) {
   const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId });

   return (
      <div className="mt-6">
         <div className="flex flex-col gap-6">
            <h1>0 comments</h1>
            <CommentForm videoId={videoId} />
         </div>

         <div className="flex flex-col gap-4 mt-2">
            {comments.map((comment) => (
               <CommentItem key={comment.id} comment={comment} />
            ))}
         </div>
      </div>
   );
}
