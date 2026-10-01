'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  href: string;
  label: string;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'link';
};

const BackButton = ({ href, label, variant = 'ghost' }: Props) => {
  return (
    <Button variant={variant} asChild>
      <Link href={href}>
        <ArrowLeftIcon /> {label}
      </Link>
    </Button>
  );
};

export default BackButton;
