'use client';

import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';

import React, { Suspense } from 'react';
import InfiniteScroll from '@/components/infinite-scroll';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

export default function VideosSection() {
   return (
      <Suspense fallback={<p>loading...</p>}>
         <ErrorBoundary fallback={<p>error...</p>}>
            <VideosSectionSuspense />
         </ErrorBoundary>
      </Suspense>
   );
}

function VideosSectionSuspense() {
   const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
      {
         limit: DEFAULT_LIMIT,
      },
      {
         getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
   );
   return (
      <div>
         <div className="border-y">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="pl-6 w-[510px]">Video</TableHead>
                     <TableHead>Visibility</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Date</TableHead>
                     <TableHead className="text-right">Views</TableHead>
                     <TableHead className="text-right">Comments</TableHead>
                     <TableHead className="text-right pr-6">Likes</TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {videos.pages
                     .flatMap((page) => page.items)
                     .map((video) => (
                        <Link
                           href={`/studio/videos/${video.id}`}
                           key={video.id}
                           legacyBehavior
                        >
                           <TableRow className="cursor-pointer">
                              <TableCell>{video.title}</TableCell>
                              <TableCell>Visibility</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Date</TableCell>
                              <TableCell>Views</TableCell>
                              <TableCell>Comments</TableCell>
                              <TableCell>Likes</TableCell>
                           </TableRow>
                        </Link>
                     ))}
               </TableBody>
            </Table>
         </div>

         <InfiniteScroll
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
         />
      </div>
   );
}
