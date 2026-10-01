import * as React from 'react';
import { MailIcon, PhoneIcon, FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react';
import ContactRow, { ContactRowItem } from '../../organizations/[username]/_components/ContactRow';
import { Volunteer } from '@prisma/types';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { badgeNames } from '@/lib/utils';

type VolunteerInfoProps = {
  volunteer: Volunteer;
};

const VolunteerInfo = ({ volunteer }: VolunteerInfoProps) => {
  const normalizeValue = (value: string | null | undefined) => value?.trim() || null;
  const normalizeUrl = (value: string) =>
    /^https?:\/\//i.test(value) ? value : `https://${value}`;

  const email = normalizeValue(volunteer.email);
  const phone = normalizeValue(volunteer.phone);
  const facebook = normalizeValue(volunteer.facebookLink);
  const instagram = normalizeValue(volunteer.instagramLink);
  const xLink = normalizeValue(volunteer.xLink);

  const contactDetails: ContactRowItem[] = [
    email && { label: 'Email', value: email, icon: MailIcon, href: `mailto:${email}` },
    phone && {
      label: 'Telefon',
      value: phone,
      icon: PhoneIcon,
      href: `tel:${phone.replace(/\s+/g, '')}`,
    },
  ].filter(Boolean) as ContactRowItem[];

  const socialLinks: ContactRowItem[] = [
    facebook && {
      label: 'Facebook',
      value: facebook,
      icon: FacebookIcon,
      href: normalizeUrl(facebook),
    },
    instagram && {
      label: 'Instagram',
      value: instagram,
      icon: InstagramIcon,
      href: normalizeUrl(instagram),
    },
    xLink && { label: 'X (Twitter)', value: xLink, icon: TwitterIcon, href: normalizeUrl(xLink) },
  ].filter(Boolean) as ContactRowItem[];

  const hasContactInfo = contactDetails.length > 0 || socialLinks.length > 0;

  const badgeSlots = Array.from({ length: 6 });
  const badgeLevel = volunteer.badgeLevel ?? 0;

  return (
    <section className="mt-6 flex flex-col gap-8">
      {/* Info sekcija */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-card/50 rounded-xl border p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">O volonteru {volunteer.fullName}</h3>
          {volunteer.bio ? (
            <div className="minimal-tiptap-content">
              <div dangerouslySetInnerHTML={{ __html: volunteer.bio }} />
            </div>
          ) : (
            <p className="text-muted-foreground">Volonter nije dodao nikakav opis o sebi.</p>
          )}
        </div>

        {hasContactInfo && (
          <div className="bg-card/50 space-y-6 rounded-xl border p-6 shadow">
            {contactDetails.length > 0 && (
              <div>
                <h4 className="text-muted-foreground mb-2 text-sm font-semibold uppercase">
                  Kontakt
                </h4>
                <div className="space-y-3">
                  {contactDetails.map((item) => (
                    <ContactRow key={item.label} {...item} />
                  ))}
                </div>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div>
                <h4 className="text-muted-foreground mb-2 text-sm font-semibold uppercase">
                  Društvene mreže
                </h4>
                <div className="space-y-3">
                  {socialLinks.map((item) => (
                    <ContactRow key={item.label} {...item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-card/50 rounded-xl border p-6 text-center shadow">
        <h3 className="mb-6 text-lg font-semibold">Dostignuća</h3>

        <div className="flex flex-wrap justify-center gap-4">
          {badgeSlots.map((_, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger>
                <Image
                  src={`/badges/Bedz_${idx + 1}.png`}
                  alt={`Badge ${idx + 1}`}
                  width={128}
                  height={128}
                  className={idx + 1 <= badgeLevel ? '' : 'opacity-30'}
                />
              </TooltipTrigger>
              <TooltipContent>{badgeNames[idx]}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolunteerInfo;
