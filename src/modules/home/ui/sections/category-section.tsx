'use client';

import FilterCarousel from '@/components/filter-carousel';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = { categoryId?: string };

export default function Categoriessection({ categoryId }: Props) {
   return (
      <Suspense
         fallback={<FilterCarousel isLoading data={[]} onSelect={() => {}} />}
      >
         <ErrorBoundary fallback={<p>error...</p>}>
            <CategoriesSectionSuspense categoryId={categoryId} />
         </ErrorBoundary>
      </Suspense>
   );
}

function CategoriesSectionSuspense({ categoryId }: Props) {
   const router = useRouter();
   const [categories] = trpc.categories.getMany.useSuspenseQuery();

   const data = categories.map(({ name, id }) => ({ value: id, label: name }));
   const onSelect = (value: string | null) => {
      const url = new URL(window.location.href);

      if (value) url.searchParams.set('categoryId', value);
      else url.searchParams.delete('categoryId');

      router.push(url.toString());
   };

   return <FilterCarousel value={categoryId} data={data} onSelect={onSelect} />;
}
