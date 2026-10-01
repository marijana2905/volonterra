'use client';

import dynamic from 'next/dynamic';
import { Loader2Icon } from 'lucide-react';

type Props = {};

// Dynamic import with SSR disabled
const FormMap = dynamic(() => import('./FormMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-accent text-muted-foreground flex h-[350px] w-full items-center justify-center rounded-xl">
      <Loader2Icon className="animate-spin" />
    </div>
  ),
});

const FormMapWrapper = (props: Props) => {
  return <FormMap />;
};

export default FormMapWrapper;
