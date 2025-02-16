import { Skeleton } from '@/components/ui/skeleton';
import { THUMBNAIL_FALLBACK } from '@/constants';
import { formatDuration } from '@/lib/utils';
import Image from 'next/image';

type Props = {
   title: string;
   duration: number;
   imageUrl?: string | null;
   previewUrl?: string | null;
};

export function VideoThumbnailSkeleton() {
   return (
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
         <Skeleton className="size-full" />
      </div>
   );
}

export default function VideoThumbnail({
   title,
   duration,
   imageUrl,
   previewUrl,
}: Readonly<Props>) {
   return (
      <div className="relative group">
         {/* thumbnail wrapper */}
         <div className="relative w-full overflow-hidden rounded-xl aspect-video">
            <Image
               src={imageUrl ?? THUMBNAIL_FALLBACK}
               alt={title}
               fill
               className="h-full w-full object-cover group-hover:opacity-0"
            />
            <Image
               unoptimized={!!previewUrl}
               src={previewUrl ?? THUMBNAIL_FALLBACK}
               alt={title}
               fill
               className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
            />
         </div>

         {/* video duration box */}
         <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
            {formatDuration(duration)}
         </div>
      </div>
   );
}
