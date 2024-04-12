import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';

import ModalProvider from '@/components/providers/modal-provider';
import QueryProvider from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';

type PlatformLayoutProps = {
  children: React.ReactNode;
};

const PlatformLayout = ({ children }: PlatformLayoutProps) => {
  return (
    <ClerkProvider>
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};

export default PlatformLayout;
