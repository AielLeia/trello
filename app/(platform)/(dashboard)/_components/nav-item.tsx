'use client';

import { Activity, CreditCard, Layout, Settings } from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

export type Organization = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
};

type NavItemProps = {
  isActive: boolean;
  isExpanded: boolean;
  organization: Organization;
  onExpand: (id: string) => void;
};

const NavItem = ({
  isActive,
  isExpanded,
  organization,
  onExpand,
}: NavItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const routes = [
    {
      label: 'Boards',
      icon: <Layout className="h-4 w-4 mr-2" />,
      href: route('/organization/[organizationId]', {
        params: { organizationId: organization.id },
      }),
    },
    {
      label: 'Activity',
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: route('/organization/[organizationId]/activity', {
        params: { organizationId: organization.id },
      }),
    },
    {
      label: 'Settings',
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: route('/organization/[organizationId]/settings', {
        params: { organizationId: organization.id },
      }),
    },
    {
      label: 'Billing',
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      href: route('/organization/[organizationId]/billing', {
        params: { organizationId: organization.id },
      }),
    },
  ];

  const onClick = (href: string) => {
    router.push(href);
  };

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          'flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-700/10 text-start no-underline hover:no-underline',
          isActive && !isExpanded && 'bg-sky-500/10 text-sky-700'
        )}
      >
        <div className="flex items-center gap-x-3">
          <div className="w-7 h-7 relative">
            <Image
              fill
              src={organization.imageUrl}
              alt="Organization"
              className="rounded-sm object-cover"
            />
          </div>
          <span className="text-sm font-medium">{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 text-neutral-700">
        {routes.map((r) => (
          <Button
            key={r.href}
            size="sm"
            onClick={() => onClick(r.href)}
            className={cn(
              'w-full font-normal justify-start pl-10 mb-1',
              pathname === r.href && 'bg-sky-500/10 text-sky-700'
            )}
            variant="ghost"
          >
            {r.icon}
            {r.label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default NavItem;
