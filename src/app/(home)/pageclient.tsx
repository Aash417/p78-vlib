'use client';

import { trpc } from '@/trpc/client';

export default function PageClient() {
   const [data] = trpc.hello.useSuspenseQuery({ text: 'aash' });

   return <div>PageClient : {data.greeting}</div>;
}
