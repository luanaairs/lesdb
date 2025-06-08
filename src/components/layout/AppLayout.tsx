
"use client";

import type React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Header } from './Header';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
import { X } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar'; // For mobile close

interface AppLayoutProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
}

function MobileSidebarCloseButton() {
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslations();
  return (
    <Button variant="ghost" size="icon" onClick={() => setOpenMobile(false)} className="md:hidden" aria-label={t('hideFilters')}>
      <X />
    </Button>
  );
}


export function AppLayout({ children, sidebarContent }: AppLayoutProps) {
  const { t } = useTranslations();
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar 
        variant="sidebar" 
        collapsible="icon" 
        className="shadow-lg"
      >
        <SidebarHeader className="flex items-center justify-between border-b">
          <h2 className="font-headline text-lg font-semibold">{t('filterBy')}</h2>
          <MobileSidebarCloseButton />
        </SidebarHeader>
        <SidebarContent>
          {sidebarContent}
        </SidebarContent>
        <SidebarFooter>
          {/* Optional: Footer content for sidebar */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
