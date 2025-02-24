'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/trpc/client';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

type Props = {
   playlistId: string;
};

export default function PlaylistHeaderSection({ playlistId }: Props) {
   return (
      <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
         <ErrorBoundary fallback={<p>error...</p>}>
            <PlaylistHeaderSectionSuspense playlistId={playlistId} />
         </ErrorBoundary>
      </Suspense>
   );
}

function PlaylistHeaderSectionSkeleton() {
   return (
      <div className="flex flex-col gap-y-2">
         <Skeleton className="h-6 w-24 " />
         <Skeleton className="h-4 w-32 " />
      </div>
   );
}

function PlaylistHeaderSectionSuspense({ playlistId }: Props) {
   const utils = trpc.useUtils();
   const router = useRouter();

   const [playlist] = trpc.playlists.getOne.useSuspenseQuery({
      id: playlistId,
   });
   const remove = trpc.playlists.remove.useMutation({
      onSuccess: () => {
         toast.success('Playlist removed');
         router.push('/playlists');
         utils.playlists.getMany.invalidate();
      },
      onError: () => {
         toast.error('something went wrong');
      },
   });

   return (
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold">{playlist.name}</h1>
            <p className="text-xs text-muted-foreground">
               Videos you have watched
            </p>
         </div>
         <Button
            variant="outline"
            className="rounded-full"
            size="icon"
            onClick={() => remove.mutate({ id: playlistId })}
            disabled={remove.isPending}
         >
            <Trash2Icon />
         </Button>
      </div>
   );
}
