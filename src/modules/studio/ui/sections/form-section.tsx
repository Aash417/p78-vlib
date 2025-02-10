'use client';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { videoUpdateSchema } from '@/db/schema';
import { snakeCaseToTitle } from '@/lib/utils';
import VideoPlayer from '@/modules/videos/ui/components/video-player';
import { trpc } from '@/trpc/client';
import {
   CopyCheckIcon,
   CopyIcon,
   Globe2Icon,
   LockIcon,
   MoreVerticalIcon,
   TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {
   videoId: string;
};

export default function FormSection({ videoId }: Readonly<Props>) {
   return (
      <Suspense fallback={<FomSectionSkeleton />}>
         <ErrorBoundary fallback={<p>error.. </p>}>
            <FormSectionSuspense videoId={videoId} />
         </ErrorBoundary>
      </Suspense>
   );
}

function FomSectionSkeleton() {
   return <div>FomSectionSkeleton</div>;
}

function FormSectionSuspense({ videoId }: Readonly<Props>) {
   const router = useRouter();
   const utils = trpc.useUtils();
   const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
   const [categories] = trpc.categories.getMany.useSuspenseQuery();

   // change if deployin outside of vercel
   const fullUrl = `${process.env.VERCEL_URL ?? 'http://localhost:3000'}/studio/videos/${videoId}`;
   const [isCopied, setIsCopied] = useState(false);

   const update = trpc.videos.update.useMutation({
      onSuccess: () => {
         utils.studio.getMany.invalidate();
         utils.studio.getOne.invalidate({ id: videoId });
         toast.success('Video updated');
      },
      onError: () => {
         toast.error('Something went wrong');
      },
   });
   const remove = trpc.videos.remove.useMutation({
      onSuccess: () => {
         utils.studio.getMany.invalidate();
         toast.success('Video Deleted');
         router.push('/studio');
      },
      onError: () => {
         toast.error('Something went wrong');
      },
   });

   const form = useForm<z.infer<typeof videoUpdateSchema>>({
      defaultValues: video,
   });

   function onSubmit(data: z.infer<typeof videoUpdateSchema>) {
      update.mutate(data);
   }

   async function onCopy() {
      await navigator.clipboard.writeText(fullUrl);

      setIsCopied(true);
      setTimeout(() => {
         setIsCopied(false);
      }, 2000);
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between mb-6">
               <div>
                  <h1 className="text-2xl font-bold">Video details</h1>
                  <p className="text-xs text-muted-foreground">
                     Manage your video details
                  </p>
               </div>

               <div className="flex items-center gap-x-2">
                  <Button type="submit" disabled={update.isPending}>
                     Save
                  </Button>

                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                           <MoreVerticalIcon />
                        </Button>
                     </DropdownMenuTrigger>

                     <DropdownMenuContent>
                        <DropdownMenuItem
                           onClick={() => remove.mutate({ id: videoId })}
                        >
                           <TrashIcon className="size-4 mr-2" />
                           Delete
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
               <div className="space-y-8 lg:col-span-3">
                  <FormField
                     control={form.control}
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>
                              Title
                              {/* todo add ai generate button */}
                           </FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 placeholder="Add a title to your video"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>
                              Description
                              {/* todo add ai generate button */}
                           </FormLabel>
                           <FormControl>
                              <Textarea
                                 {...field}
                                 value={field.value ?? ''}
                                 rows={10}
                                 className="resize-none pr-10"
                                 placeholder="Add a description to your video"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* todo add thumbnail field here  */}

                  <FormField
                     control={form.control}
                     name="categoryId"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>
                              Category
                              {/* todo add ai generate button */}
                           </FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value ?? undefined}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                 </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                 {categories.map((category) => (
                                    <SelectItem
                                       key={category.id}
                                       value={category.id}
                                    >
                                       {category.name}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <div className="flex flex-col gap-y-8 lg:col-span-2">
                  <div className="flex flex-col gap-3 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                     <div className="aspect-video overflow-hidden relative">
                        <VideoPlayer
                           playbackId={video.muxPlaybackId}
                           thumbnailUrl={video.thumbnailUrl}
                        />
                     </div>

                     <div className="p-4 flex flex-col gap-y-6">
                        <div className="flex justify-between  gap-x-2">
                           <div className="flex flex-col gap-y-1">
                              <p className="text-muted-foreground text-xs">
                                 Video link
                              </p>
                              <div className="flex items-center gap-x-2">
                                 <Link href={`/videos/${video.id}`}>
                                    <p className="line-clamp-1 text-sm text-blue-500">
                                       {fullUrl}
                                    </p>
                                 </Link>

                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0"
                                    onClick={onCopy}
                                    disabled={isCopied}
                                 >
                                    {isCopied ? (
                                       <CopyCheckIcon />
                                    ) : (
                                       <CopyIcon />
                                    )}
                                 </Button>
                              </div>
                           </div>
                        </div>

                        <div className="flex justify-between items-center">
                           <div className="flex-col flex gap-y-1">
                              <p className="text-muted-foreground text-xs">
                                 status
                              </p>
                              <p className="text-sm">
                                 {snakeCaseToTitle(
                                    video.muxStatus ?? 'preparing',
                                 )}
                              </p>
                           </div>
                        </div>

                        <div className="flex justify-between items-center">
                           <div className="flex-col flex gap-y-1">
                              <p className="text-muted-foreground text-xs">
                                 Subtitles status
                              </p>
                              <p className="text-sm">
                                 {snakeCaseToTitle(
                                    video.muxTrackStatus ?? 'no audio',
                                 )}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <FormField
                     control={form.control}
                     name="visibility"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>
                              Visibility
                              {/* todo add ai generate button */}
                           </FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value ?? undefined}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select visibility" />
                                 </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                 <SelectItem value="public">
                                    <div className="flex items-center">
                                       <Globe2Icon className="size-4 mr-2" />
                                       Public
                                    </div>
                                 </SelectItem>
                                 <SelectItem value="private">
                                    <div className="flex items-center">
                                       <LockIcon className="size-4 mr-2" />
                                       Private
                                    </div>
                                 </SelectItem>
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
            </div>
         </form>
      </Form>
   );
}
