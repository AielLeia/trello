'use client';

import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useIsClient } from 'usehooks-ts';

import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';

import Sidebar from '@/app/(platform)/(dashboard)/_components/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const MobileSidebar = () => {
  const pathname = usePathname();
  const isClient = useIsClient();

  const { isOpen, onOpen, onClose } = useMobileSidebar((state) => state);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isClient) return null;

  return (
    <>
      <Button
        onClick={onOpen}
        className="block md:hidden mr-2pnp"
        variant="ghost"
        size="sm"
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="p-2 pt-10" side="left">
          <Sidebar storageKey="t-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
