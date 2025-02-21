'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import VideoRowCard, {
   VideoRowCardSkeleton,
} from '@/modules/videos/ui/components/video-row-card';
import VideoGridCard, {
   VideoGridCardSkeleton,
} from '@/modules/videos/ui/components/view-grid-card';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

type Props = {
   playlistId: string;
};

export default function VideoSection({ playlistId }: Props) {
   return (
      <Suspense fallback={<VideoSectionSkeleton />}>
         <ErrorBoundary fallback={<p>error...</p>}>
            <VideoSectionSuspense playlistId={playlistId} />
         </ErrorBoundary>
      </Suspense>
   );
}

function VideoSectionSkeleton() {
   return (
      <div>
         <div className="flex flex-col gap-4 gap-y-10 md:hidden">
            {Array.from({ length: 18 }).map((_, index) => (
               <VideoGridCardSkeleton key={index + 1} />
            ))}
         </div>

         <div className="hidden flex-col gap-4 md:flex">
            {Array.from({ length: 18 }).map((_, index) => (
               <VideoRowCardSkeleton key={index + 1} size="compact" />
            ))}
         </div>
      </div>
   );
}

function VideoSectionSuspense({ playlistId }: Props) {
   const utils = trpc.useUtils();
   const [videos, query] = trpc.playlists.getVideos.useSuspenseInfiniteQuery(
      { playlistId, limit: DEFAULT_LIMIT },
      {
         getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
   );

   const removeVideo = trpc.playlists.removeVideo.useMutation({
      onSuccess: (data) => {
         toast.success('Video removed from playlist');
         utils.playlists.getMany.invalidate();
         utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId });
         utils.playlists.getOne.invalidate({ id: data.playlistId });
         utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
      },
      onError: () => {
         toast.success('Something went wrong');
      },
   });

   return (
      <>
         <div className="flex flex-col gap-4 gap-y-10 md:hidden">
            {videos.pages
               .flatMap((page) => page.items)
               .map((video) => (
                  <VideoGridCard
                     key={video.id}
                     data={video}
                     onRemove={() =>
                        removeVideo.mutate({ playlistId, videoId: video.id })
                     }
                  />
               ))}
         </div>

         <div className="hidden flex-col gap-4 md:flex">
            {videos.pages
               .flatMap((page) => page.items)
               .map((video) => (
                  <VideoRowCard
                     key={video.id}
                     data={video}
                     size="compact"
                     onRemove={() =>
                        removeVideo.mutate({ playlistId, videoId: video.id })
                     }
                  />
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
