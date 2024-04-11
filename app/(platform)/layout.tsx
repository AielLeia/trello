import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';

import { Toaster } from '@/components/ui/sonner';

type PlatformLayoutProps = {
  children: React.ReactNode;
};

const PlatformLayout = ({ children }: PlatformLayoutProps) => {
  return (
    <ClerkProvider>
      <Toaster />
      {children}
    </ClerkProvider>
  );
};

export default PlatformLayout;
