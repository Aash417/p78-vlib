import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { UserGetOneOutput } from '../../types';
import { Edit2Icon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
   user: UserGetOneOutput;
};

export default function UserPageBanner({ user }: Props) {
   const { userId } = useAuth();

   return (
      <div className="relative group">
         <div
            className={cn(
               'w-full, max-h-[200px] h-[15vh] md:h-[25vh] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl',
               user.bannerUrl ? 'bg-cover bg-center' : 'bg-gray-100',
            )}
            style={{
               backgroundImage: user.bannerUrl
                  ? `url(${user.bannerUrl})`
                  : undefined,
            }}
         >
            {user.clerkId === userId && (
               <Button
                  type="button"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/50 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
               >
                  <Edit2Icon className="siz" />
               </Button>
            )}
         </div>
      </div>
   );
}

export function UserPageBannerSkeleton() {
   return <Skeleton className="w-full max-h-[200px] h-[15vh] md:h-[25vh]" />;
}
