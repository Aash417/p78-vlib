'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';
import SubscriptionItem, {
   SubscriptionItemSkeleton,
} from './subscription-item';

export default function SubscriptionsSection() {
   return (
      <Suspense fallback={<SubscriptionsSectionSkeleton />}>
         <ErrorBoundary fallback={<p>error...</p>}>
            <SubscriptionsSectionSuspense />
         </ErrorBoundary>
      </Suspense>
   );
}

function SubscriptionsSectionSkeleton() {
   return (
      <div className="flex flex-col gap-4">
         {Array.from({ length: 18 }).map((_, index) => (
            <SubscriptionItemSkeleton key={index + 1} />
         ))}
      </div>
   );
}

function SubscriptionsSectionSuspense() {
   const utils = trpc.useUtils();
   const [subscriptions, query] =
      trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
         { limit: DEFAULT_LIMIT },
         {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
         },
      );

   const unsubscribe = trpc.subscriptions.remove.useMutation({
      onSuccess: (data) => {
         toast.success('Unsubscribed');
         utils.subscriptions.getMany.invalidate();
         utils.videos.getManySubscribed.invalidate();
         utils.users.getOne.invalidate({ id: data.creatorId });
      },
      onError: () => {
         toast.error('something went wrong');
      },
   });
   return (
      <>
         <div className="flex flex-col gap-4 ">
            {subscriptions.pages
               .flatMap((page) => page.items)
               .map((subscription) => (
                  <Link
                     href={`/users/${subscription.user.id}`}
                     key={subscription.creatorId}
                  >
                     <SubscriptionItem
                        name={subscription.user.name}
                        imageUrl={subscription.user.imageUrl}
                        subscriberCount={subscription.user.subscriberCount}
                        onUnsubscribe={() => {
                           unsubscribe.mutate({
                              userId: subscription.creatorId,
                           });
                        }}
                        disabled={unsubscribe.isPending}
                     />
                  </Link>
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
