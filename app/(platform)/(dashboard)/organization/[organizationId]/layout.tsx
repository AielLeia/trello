import { auth } from '@clerk/nextjs';
import { startCase } from 'lodash';
import React from 'react';

import OrgControl from '@/app/(platform)/(dashboard)/organization/[organizationId]/_components/org-control';

export async function generateMetadata() {
  const { orgSlug } = auth();

  return {
    title: startCase(orgSlug || 'organization'),
  };
}

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
