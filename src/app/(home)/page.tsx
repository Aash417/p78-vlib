import { trpc } from '@/trpc/client';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function Page() {
   // const { data } = trpc.hello.useQuery({ text: 'aash' });

   return (
      <HydrateClient>
         <Suspense fallback={<p>loading..</p>}>
            {/* <ErrorBoundary></ErrorBoundary> */}
         </Suspense>
      </HydrateClient>
   );
}
