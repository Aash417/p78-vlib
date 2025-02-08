import { HydrateClient, trpc } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import PageClient from './pageclient';

export default async function Page() {
   void trpc.hello.prefetch({ text: 'aash' });

   return (
      <HydrateClient>
         <Suspense fallback={<p>loading..</p>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
               <PageClient />
            </ErrorBoundary>
         </Suspense>
      </HydrateClient>
   );
}
