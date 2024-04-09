import React from 'react';

import OrgControl from '@/app/(platform)/(dashboard)/organization/[organizationId]/_components/org-control';

type OrganizationIdLayoutProps = {
  children: React.ReactNode;
};

const OrganizationIdLayout = ({ children }: OrganizationIdLayoutProps) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default OrganizationIdLayout;
