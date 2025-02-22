import ResponsiveModal from '@/components/responsive-dialog';
import { UploadDropzone } from '@/lib/uploadthing';
import { trpc } from '@/trpc/client';
import React from 'react';

type Props = {
   userId: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export default function BannerUploadModal({
   userId,
   open,
   onOpenChange,
}: Readonly<Props>) {
   const utils = trpc.useUtils();

   function onUploadComplete() {
      utils.users.getOne.invalidate({ id: userId });
      onOpenChange(false);
   }

   return (
      <ResponsiveModal
         title="Upload a banner"
         open={open}
         onOpenChange={onOpenChange}
      >
         <UploadDropzone
            endpoint="bannerUploader"
            onClientUploadComplete={onUploadComplete}
         />
      </ResponsiveModal>
   );
}
