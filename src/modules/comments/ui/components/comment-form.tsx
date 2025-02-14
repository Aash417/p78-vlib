'use client';

import { Button } from '@/components/ui/button';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import UserAvatar from '@/components/user-avatar';
import { commentInsertSchema } from '@/db/schema';
import { trpc } from '@/trpc/client';
import { useClerk, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {
   videoId: string;
   parentId?: string;
   variant?: 'reply' | 'comment';
   onSuccess?: () => void;
   onCancel?: () => void;
};

export default function CommentForm({
   videoId,
   parentId,
   variant = 'comment',
   onSuccess,
   onCancel,
}: Props) {
   const { user } = useUser();
   const utils = trpc.useUtils();
   const clerk = useClerk();

   const create = trpc.comments.create.useMutation({
      onSuccess: () => {
         utils.comments.getMany.invalidate({ videoId });
         utils.comments.getMany.invalidate({ videoId, parentId });
         form.reset();
         toast.success('Comment added ');
         onSuccess?.();
      },
      onError: (error) => {
         toast.error('something went wrong');
         if (error.data?.code === 'UNAUTHORIZED') clerk.openSignIn();
      },
   });

   const form = useForm<z.infer<typeof commentInsertSchema>>({
      resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
      defaultValues: {
         parentId: parentId,
         videoId,
         value: '',
      },
   });

   function onSubmit(values: z.infer<typeof commentInsertSchema>) {
      create.mutate(values);
   }

   function onHandleCancel() {
      form.reset();
      onCancel?.();
   }

   return (
      <Form {...form}>
         <form
            className="flex gap-4 group"
            onSubmit={form.handleSubmit(onSubmit)}
         >
            <UserAvatar
               size="lg"
               imageUrl={user?.imageUrl || '/user-placeholder.svg'}
               name={user?.username || 'user'}
            />

            <div className="flex-1">
               <FormField
                  name="value"
                  control={form.control}
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Textarea
                              {...field}
                              placeholder={
                                 variant === 'reply'
                                    ? 'Reply to this comment..'
                                    : 'Add a comment'
                              }
                              className="resize-none bg-transparent overflow-hidden min-h-0"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <div className="justify-end mt-2 flex">
                  {onCancel && (
                     <Button
                        variant="ghost"
                        type="button"
                        onClick={onHandleCancel}
                     >
                        Cancel
                     </Button>
                  )}
                  <Button type="submit" size="sm" disabled={create.isPending}>
                     {variant === 'reply' ? 'Reply' : 'Comment'}
                  </Button>
               </div>
            </div>
         </form>
      </Form>
   );
}
