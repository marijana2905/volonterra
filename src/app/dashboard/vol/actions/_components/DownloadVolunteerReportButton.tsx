'use client';

import { useTransition } from 'react';

import { generateVolunteerReport } from '@/actions/volunteer/generateActionsReport';

import { Button } from '@/components/ui/button';
import { DownloadIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

const DownloadVolunteerReportButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleDownload = () => {
    startTransition(async () => {
      try {
        const result = await generateVolunteerReport();

        if ('error' in result) {
          toast.error(result.error);
          return;
        }

        const { fileBase64, fileName, mimeType } = result;
        const bytes = base64ToUint8Array(fileBase64);
        const arrayBuffer = bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength
        ) as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        URL.revokeObjectURL(url);
        toast.success('Izveštaj je spreman za preuzimanje.');
      } catch (error) {
        console.error('[DownloadVolunteerReportButton]', error);
        toast.error('Došlo je do greške prilikom generisanja izveštaja.');
      }
    });
  };

  return (
    <Button onClick={handleDownload} disabled={isPending}>
      {isPending ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
      {isPending ? 'Generisanje...' : 'Preuzmi izveštaj'}
    </Button>
  );
};

export default DownloadVolunteerReportButton;
