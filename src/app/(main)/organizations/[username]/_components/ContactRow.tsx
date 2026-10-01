import { LucideIcon } from 'lucide-react';
import Copy from '@/components/global/Copy';

export type ContactRowItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  href?: string;
};

const ContactRow = ({ icon: Icon, label, value, href }: ContactRowItem) => {
  const isExternal = href ? /^https?:\/\//i.test(href) : false;

  return (
    <div className="bg-card/40 hover:bg-card/60 flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors">
      <div className="flex min-w-0 items-start gap-4">
        <div className="bg-primary/10 text-primary mt-0.5 flex size-9 items-center justify-center rounded-full">
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 space-y-1 text-left">
          <p className="text-sm leading-none font-semibold">{label}</p>
          {href ? (
            <a
              href={href}
              className="text-muted-foreground hover:text-primary text-sm break-words transition-colors"
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noreferrer' : undefined}
            >
              {value}
            </a>
          ) : (
            <p className="text-muted-foreground text-sm break-words">{value}</p>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <Copy copyText={value} />
      </div>
    </div>
  );
};

export default ContactRow;
