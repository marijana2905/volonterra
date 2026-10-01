import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';

type ButtonLinkProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    href: string;
    label: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    className?: string;
  };

const ButtonLink = ({
  href,
  label,
  icon: Icon,
  iconPosition = 'left',
  variant,
  size,
  className,
  ...props
}: ButtonLinkProps) => {
  return (
    <Button asChild variant={variant} size={size} className={className} {...props}>
      <Link href={href} className="flex items-center gap-2">
        {iconPosition === 'left' && Icon && <Icon className="shrink-0" />}
        {label}
        {iconPosition === 'right' && Icon && <Icon className="shrink-0" />}
      </Link>
    </Button>
  );
};

export default ButtonLink;
