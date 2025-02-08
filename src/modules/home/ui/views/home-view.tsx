import React from 'react';
import CategoriesSection from '../sections/category-section';

type Props = { categoryId?: string };

export default function HomeView({ categoryId }: Props) {
   return (
      <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col">
         <CategoriesSection categoryId={categoryId} />
      </div>
   );
}
