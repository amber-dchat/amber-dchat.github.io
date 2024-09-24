import { useMediaQuery } from '@/hooks/use-media-query';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer';

export interface ResponsiveDialogProps {
  title?: string;
  description?: string;
  header?: React.JSX.Element;
  children?: React.JSX.Element[] | React.JSX.Element;
  open: boolean;
  setOpen: (a: boolean) => void;
}

export function ResponsiveDialog({
  title,
  description,
  open,
  setOpen,
  header,
  children,
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {header}
              <span>{title}</span>
            </DialogTitle>

            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {header}

            <span>{title}</span>
          </DrawerTitle>

          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-4">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
