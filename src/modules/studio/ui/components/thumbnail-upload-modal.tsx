import ResponsiveModal from '@/components/responsive-dialog';
import { UploadDropzone } from '@/lib/uploadthing';
import { trpc } from '@/trpc/client';
import React from 'react';

type Props = {
   videoId: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export default function ThumbnailUploadModal({
   videoId,
   open,
   onOpenChange,
}: Readonly<Props>) {
   const utils = trpc.useUtils();

   function onUploadComplete() {
      utils.studio.getOne.invalidate({ id: videoId });
      utils.studio.getMany.invalidate();
      onOpenChange(false);
   }

   return (
      <ResponsiveModal
         title="Upload a thumbnail"
         open={open}
         onOpenChange={onOpenChange}
      >
         <UploadDropzone
            input={{ videoId }}
            endpoint="thumbnailUploader"
            onClientUploadComplete={onUploadComplete}
         />
      </ResponsiveModal>
   );
}
