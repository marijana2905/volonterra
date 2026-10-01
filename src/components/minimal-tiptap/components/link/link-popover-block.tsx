import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { ToolbarButton } from '../toolbar-button';
import {
  CopyIcon,
  ExternalLinkIcon,
  LinkBreak2Icon,
} from '@radix-ui/react-icons';

interface LinkPopoverBlockProps {
  url: string;
  onClear: () => void;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const LinkPopoverBlock: React.FC<LinkPopoverBlockProps> = ({
  url,
  onClear,
  onEdit,
}) => {
  const [copyTitle, setCopyTitle] = React.useState<string>('Kopiraj');

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopyTitle('Iskopirano!');
          setTimeout(() => setCopyTitle('Kopiraj'), 1000);
        })
        .catch(console.error);
    },
    [url],
  );

  const handleOpenLink = React.useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [url]);

  return (
    <div className="bg-background flex h-10 overflow-hidden rounded p-2 shadow-lg">
      <div className="inline-flex items-center gap-1">
        <ToolbarButton
          tooltip="Izmeni vezu"
          onClick={onEdit}
          className="w-auto px-2"
        >
          Izmeni vezu
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-2" />
        <ToolbarButton
          tooltip="Otvori u novoj kartici"
          onClick={handleOpenLink}
        >
          <ExternalLinkIcon className="size-4" />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-2" />
        <ToolbarButton tooltip="Skloni vezu" onClick={onClear}>
          <LinkBreak2Icon className="size-4" />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-2" />
        <ToolbarButton
          tooltip={'Kopiraj vezu'}
          onClick={handleCopy}
          tooltipOptions={{
            onPointerDownOutside: (e) => {
              if (e.target === e.currentTarget) e.preventDefault();
            },
          }}
        >
          <CopyIcon className="size-4" />
        </ToolbarButton>
      </div>
    </div>
  );
};
