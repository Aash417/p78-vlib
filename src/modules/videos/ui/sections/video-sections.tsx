'use client';

import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import VideoBanner from '../components/video-banner';
import VideoPlayer from '../components/video-player';
import VideoTopRow from '../components/video-top-row';

type Props = {
   videoId: string;
};

export default function VideoSection({ videoId }: Props) {
   return (
      <Suspense fallback={<p>loading..</p>}>
         <ErrorBoundary fallback={<p>error ..</p>}>
            <VideoSectionSuspense videoId={videoId} />
         </ErrorBoundary>
      </Suspense>
   );
}

function VideoSectionSuspense({ videoId }: Props) {
   const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });

   return (
      <>
         <div
            className={cn(
               'aspect-video bg-black rounded-xl overflow-hidden relative',
               video.muxStatus !== 'ready' && 'rounded-b-none',
            )}
         >
            <VideoPlayer
               autoPlay
               onPlay={() => { }}
               playbackId={video.muxPlaybackId}
               thumbnailUrl={video.thumbnailUrl}
            />
         </div>

         <VideoBanner status={video.muxStatus} />
         <VideoTopRow video={video} />
      </>
   );
}
