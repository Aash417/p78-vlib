'use client';

import MuxPlayer from '@mux/mux-player-react';

type Props = {
   playbackId?: string | null | undefined;
   thumbnailUrl?: string | null | undefined;
   autoPlay?: boolean;
   onPlay?: () => void;
};

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
         poster={thumbnailUrl ?? '/placeholder.svg'}
         playerInitTime={0}
         autoPlay={autoPlay}
         thumbnailTime={0}
         className="w-full h-full object-contain"
         accentColor="#FF2056"
         onPlay={onPlay}
      />
   );
}
