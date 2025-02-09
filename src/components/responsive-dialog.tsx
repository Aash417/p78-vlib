import { useIsMobile } from '@/hooks/use-mobile';
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

type Props = {
   children: React.ReactNode;
   open: boolean;
   title: string;
   onOpenChange: (open: boolean) => void;
};

export default function ResponsiveModal({
   children,
   open,
   title,
   onOpenChange,
}: Props) {
   const isMobile = useIsMobile();

   if (isMobile) {
      return (
         <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
               <DrawerHeader>
                  <DrawerTitle>{title}</DrawerTitle>
               </DrawerHeader>

               {children}
            </DrawerContent>
         </Drawer>
      );
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            {children}
         </DialogContent>
      </Dialog>
   );
}
