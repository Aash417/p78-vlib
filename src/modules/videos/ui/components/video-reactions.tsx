import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';

// todo properly implements video reaction
export default function VideoReactions() {
   const viewerReaction: 'like' | 'dislike' = 'like';

   return (
      <div className="flex items-center flex-none">
         <Button
            className="rounded-l-full rounded-r-none gap-2 pr-4"
            variant="secondary"
         >
            <ThumbsUpIcon
               className={cn(
                  'size-5',
                  viewerReaction === 'like' && 'fill-black',
               )}
            />
            {1}
         </Button>

         <Separator orientation="vertical" className="h-7" />

         <Button
            className="rounded-l-none rounded-r-full gap-2 pl-4 "
            variant="secondary"
         >
            <ThumbsDownIcon
               className={cn(
                  'size-5',
                  viewerReaction !== 'like' && 'fill-black',
               )}
            />
            {1}
         </Button>
      </div>
   );
}
