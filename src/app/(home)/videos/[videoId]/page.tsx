import VideoView from '@/modules/videos/ui/views/video-view';
import { HydrateClient, trpc } from '@/trpc/server';

type Props = {
   params: Promise<{
      videoId: string;
   }>;
};

export default async function Page({ params }: Props) {
   const { videoId } = await params;

   void trpc.videos.getOne.prefetch({ id: videoId });

   return (
      <HydrateClient>
         <VideoView videoId={videoId} />
      </HydrateClient>
   );
}
