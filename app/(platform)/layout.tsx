import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';

type PlatformLayoutProps = {
  children: React.ReactNode;
};

const PlatformLayout = ({ children }: PlatformLayoutProps) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default PlatformLayout;
