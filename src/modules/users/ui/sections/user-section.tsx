'use client';

import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import UserPageBanner, {
   UserPageBannerSkeleton,
} from '../components/user-page-banner';
import UserPageInfo, {
   UserPageInfoSkeleton,
} from '../components/user-page-info';
import { Separator } from '@/components/ui/separator';

type Props = {
   userId: string;
};

export default function UserSection({ userId }: Props) {
   return (
      <Suspense fallback={<UserSectionSkeleton />}>
         <ErrorBoundary fallback={<p>error.. </p>}>
            <UserSectionSuspense userId={userId} />
         </ErrorBoundary>
      </Suspense>
   );
}

function UserSectionSkeleton() {
   return (
      <div className="flex flex-col">
         <UserPageBannerSkeleton />
         <UserPageInfoSkeleton />
      </div>
   );
}

function UserSectionSuspense({ userId }: Props) {
   const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });

   return (
      <div>
         <UserPageBanner user={user} />
         <UserPageInfo user={user} />
         <Separator />
      </div>
   );
}
