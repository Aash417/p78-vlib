import Link from 'next/link';
import { VideoGetManyOutput } from '../../types';
import VideoInfo, { VideoInfoSkeleton } from './video-info';
import VideoThumbnail, { VideoThumbnailSkeleton } from './video-thumbnail';

type Props = {
   data: VideoGetManyOutput['items'][number];
   onRemove?: () => void;
};

export function VideoGridCardSkeleton() {
   return (
      <div className="flex flex-col gap-2 w-full">
         <VideoThumbnailSkeleton />
         <VideoInfoSkeleton />
      </div>
   );
}

export default function VideoGridCard({ data, onRemove }: Props) {
   return (
      <div className="flex flex-col gap-2 w-full group">
         <Link href={`/videos/${data.id}`}>
            <VideoThumbnail
               imageUrl={data.thumbnailUrl}
               previewUrl={data.previewUrl}
               title={data.title}
               duration={data.duration}
            />
         </Link>

         <VideoInfo data={data} onRemove={onRemove} />
      </div>
   );
}
