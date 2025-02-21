import PlaylistHeaderSection from '../sections/playlist-header-section';
import VideoSection from '../sections/videos-section';

type Props = {
   playlistId: string;
};

export default function VideosView({ playlistId }: Props) {
   return (
      <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-4">
         <PlaylistHeaderSection playlistId={playlistId} />

         <VideoSection playlistId={playlistId} />
      </div>
   );
}
