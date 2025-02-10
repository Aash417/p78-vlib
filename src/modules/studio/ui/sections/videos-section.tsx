'use client';

import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';

import InfiniteScroll from '@/components/infinite-scroll';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { snakeCaseToTitle } from '@/lib/utils';
import VideoThumbnail from '@/modules/videos/ui/components/video-thumbnail';
import { format } from 'date-fns';
import { Globe2Icon, LockIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

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
                              <TableCell>
                                 <div className=" flex items-center gap-4">
                                    <div className="relative aspect-video w-36 shrink-0">
                                       <VideoThumbnail
                                          title={video.title}
                                          duration={video.duration || 0}
                                          imageUrl={video.thumbnailUrl}
                                          previewUrl={video.previewUrl}
                                       />
                                    </div>

                                    <div className="flex flex-col overflow-hidden gap-y-1">
                                       <span className="text-sm line-clamp-1">
                                          {video.title}
                                       </span>
                                       <span className="text-sm text-muted-foreground line-clamp-1">
                                          {video.description ||
                                             'No description'}
                                       </span>
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center">
                                    {video.visibility === 'private' ? (
                                       <LockIcon className="size-4 mr-2" />
                                    ) : (
                                       <Globe2Icon className="size-4 mr-2" />
                                    )}
                                    {snakeCaseToTitle(video.visibility)}
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center">
                                    {snakeCaseToTitle(
                                       video.muxStatus || 'error',
                                    )}
                                 </div>
                              </TableCell>
                              <TableCell>
                                 {format(
                                    new Date(video.createdAt),
                                    'd MMM yyyy',
                                 )}
                              </TableCell>
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
