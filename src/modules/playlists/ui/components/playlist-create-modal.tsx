'use client';

import ResponsiveModal from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { trpc } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

const formSchema = z.object({
   name: z.string().min(1),
});

export default function PlaylistCreateModal({
   open,
   onOpenChange,
}: Readonly<Props>) {
   const utils = trpc.useUtils();
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: '',
      },
   });

   const create = trpc.playlists.create.useMutation({
      onSuccess: () => {
         utils.playlists.getMany.invalidate();
         toast.success('Playlist created');
         form.reset();
         onOpenChange(false);
      },
      onError: () => {
         toast.error('something went wrong');
      },
   });

   function onSubmit(values: z.infer<typeof formSchema>) {
      create.mutate(values);
   }

   return (
      <ResponsiveModal
         title="Create a playlist"
         open={open}
         onOpenChange={onOpenChange}
      >
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                           <Input {...field} placeholder="My favroite videos" />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <div className="flex justify-end pt-4">
                  <Button disabled={create.isPending} type="submit">
                     Create
                  </Button>
               </div>
            </form>
         </Form>
      </ResponsiveModal>
   );
}
