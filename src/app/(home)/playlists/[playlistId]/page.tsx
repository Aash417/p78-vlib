import { DEFAULT_LIMIT } from '@/constants';
import VideosView from '@/modules/playlists/ui/views/videos-view';
import { HydrateClient, trpc } from '@/trpc/server';

type Props = {
   params: Promise<{
      playlistId: string;
   }>;
};

export const dynamic = 'force-dynamic';

export default async function Page({ params }: Props) {
   const { playlistId } = await params;

   void trpc.playlists.getVideos.prefetchInfinite({
      playlistId,
      limit: DEFAULT_LIMIT,
   });
   void trpc.playlists.getOne.prefetch({ id: playlistId });

   return (
      <HydrateClient>
         <VideosView playlistId={playlistId} />
      </HydrateClient>
   );
}
