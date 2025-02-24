'use client';

import { THUMBNAIL_FALLBACK } from '@/constants';
import MuxPlayer from '@mux/mux-player-react';

type Props = {
   playbackId?: string | null | undefined;
   thumbnailUrl?: string | null | undefined;
   autoPlay?: boolean;
   onPlay?: () => void;
};

export function VideoPlayerSkeleton() {
   return <div className="aspect-video bg-black rounded-xl overflow-hidden" />;
}

export default function VideoPlayer({
   playbackId,
   thumbnailUrl,
   autoPlay,
   onPlay,
}: Readonly<Props>) {
   // if (!playbackId) return null;

   return (
      <MuxPlayer
         playbackId={playbackId ?? ''}
         poster={thumbnailUrl ?? THUMBNAIL_FALLBACK}
         playerInitTime={0}
         autoPlay={autoPlay}
         thumbnailTime={0}
         className="w-full h-full object-contain"
         accentColor="#FF2056"
         onPlay={onPlay}
      />
   );
}
