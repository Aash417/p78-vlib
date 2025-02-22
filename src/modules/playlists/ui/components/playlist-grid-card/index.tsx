import { THUMBNAIL_FALLBACK } from '@/constants';
import { PlaylistGetManyOutput } from '@/modules/playlists/types';
import Link from 'next/link';
import PlaylistInfo, { PlaylistInfoSkeleton } from './playlist-info';
import PlaylistThumbnail, {
   PlaylistThumbnailSkeleton,
} from './playlist-thumbnail';

type Props = {
   data: PlaylistGetManyOutput['items'][number];
};

export function PlaylistGridCardSkeleton() {
   return (
      <div className="flex flex-col gap-2 w-full">
         <PlaylistThumbnailSkeleton />
         <PlaylistInfoSkeleton />
      </div>
   );
}

export default function PlaylistGridCard({ data }: Props) {
   return (
      <Link prefetch href={`/playlists/${data.id}`}>
         <div className="flex flex-col gap-2 w-full group">
            <PlaylistThumbnail
               imageUrl={data.thumbnailUrl || THUMBNAIL_FALLBACK}
               title={data.name}
               videoCount={data.videoCount}
            />
            <PlaylistInfo data={data} />
         </div>
      </Link>
   );
}
