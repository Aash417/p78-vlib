import { Button } from '@/components/ui/button';
import {
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { APP_URL } from '@/constants';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import {
   ListPlusIcon,
   MoreVerticalIcon,
   ShareIcon,
   Trash2Icon,
} from 'lucide-react';
import { toast } from 'sonner';

type Props = {
   videoId: string;
   variant?: 'ghost' | 'secondary';
   onRemove?: () => void;
};

// todo implement whats left
export default function VideoMenu({
   variant = 'ghost',
   videoId,
   onRemove,
}: Props) {
   function onShare() {
      // change if deployin outside of vercel
      const fullUrl = `${APP_URL}/videos/${videoId}`;

      navigator.clipboard.writeText(fullUrl);
      toast.success('Link copied to clipboard');
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant={variant} size="icon" className="rounded-full">
               <MoreVerticalIcon />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={onShare}>
               <ShareIcon className="mr-2 size-4" />
               Share
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => {}}>
               <ListPlusIcon className="mr-2 size-4" />
               Add to playlist
            </DropdownMenuItem>

            {onRemove && (
               <DropdownMenuItem onClick={() => {}}>
                  <Trash2Icon className="mr-2 size-4" />
                  Remove
               </DropdownMenuItem>
            )}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
