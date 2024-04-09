import React from 'react';

type ClerkLayoutProps = {
  children: React.ReactNode;
};

const ClerkLayout = ({ children }: ClerkLayoutProps) => {
  return (
    <div className="h-full flex items-center justify-center">{children}</div>
  );
};

export default ClerkLayout;
