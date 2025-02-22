'use client';
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LogOutIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StudioSidebarHeader from './studio-sidebar-header';

export default function StudioSidebar() {
   const pathname = usePathname();

   return (
      <Sidebar className="pt-16 z-40" collapsible="icon">
         <SidebarContent className="bg-background">
            <SidebarGroup>
               <SidebarMenu>
                  <StudioSidebarHeader />

                  <SidebarMenuItem>
                     <SidebarMenuButton
                        isActive={pathname === '/studio'}
                        tooltip="Content"
                        asChild
                     >
                        <Link prefetch href="/studio">
                           <VideoIcon className="size-5" />
                           <span className="text-sm">Content</span>
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               </SidebarMenu>

               <SidebarMenu>
                  <SidebarMenuItem>
                     <SidebarMenuButton tooltip="Exit studio" asChild>
                        <Link prefetch href="/">
                           <LogOutIcon className="size-5" />{' '}
                           <span className="text-sm">Exit studio</span>
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               </SidebarMenu>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   );
}
