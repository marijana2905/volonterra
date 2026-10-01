import { OrganizerProfile } from '@/types/organizer.type';

import ContactRow, { ContactRowItem } from './ContactRow';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  CreditCardIcon,
  FacebookIcon,
  GlobeIcon,
  HouseIcon,
  LandmarkIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleQuestionMarkIcon,
  PhoneIcon,
  TwitterIcon,
  InstagramIcon,
} from 'lucide-react';
import AskOrganizerForm from './AskOrganizerForm';

type OrganizerTabsProps = {
  organizer: OrganizerProfile;
};

const OrganizerTabs = ({ organizer }: OrganizerTabsProps) => {
  const normalizeValue = (value: string | null) => value?.trim() || null;

  const normalizeUrl = (value: string) => {
    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `https://${value}`;
  };

  const phone = normalizeValue(organizer.phone);
  const address = normalizeValue(organizer.address);
  const website = normalizeValue(organizer.website);
  const facebook = normalizeValue(organizer.facebookLink);
  const instagram = normalizeValue(organizer.instagramLink);
  const xLink = normalizeValue(organizer.xLink);
  const paypal = normalizeValue(organizer.paypalLink);
  const bankAccount = normalizeValue(organizer.bankAccount);

  const contactDetails = [
    {
      label: 'Email',
      value: organizer.email.trim(),
      icon: MailIcon,
      href: `mailto:${organizer.email.trim()}`,
    },
    phone && {
      label: 'Telefon',
      value: phone,
      icon: PhoneIcon,
      href: `tel:${phone.replace(/\s+/g, '')}`,
    },
    address && {
      label: 'Adresa',
      value: address,
      icon: MapPinIcon,
    },
    website && {
      label: 'Veb sajt',
      value: website,
      icon: GlobeIcon,
      href: normalizeUrl(website),
    },
  ].filter(Boolean) as ContactRowItem[];

  const socialLinks = [
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
    xLink && {
      label: 'X (Twitter)',
      value: xLink,
      icon: TwitterIcon,
      href: normalizeUrl(xLink),
    },
  ].filter(Boolean) as ContactRowItem[];

  const financialLinks = [
    paypal && {
      label: 'PayPal',
      value: paypal,
      icon: CreditCardIcon,
      href: normalizeUrl(paypal),
    },
    bankAccount && {
      label: 'Žiro račun',
      value: bankAccount,
      icon: LandmarkIcon,
    },
  ].filter(Boolean) as ContactRowItem[];

  const hasContactInfo =
    contactDetails.length > 0 || socialLinks.length > 0 || financialLinks.length > 0;

  return (
    <Tabs defaultValue="tab-1" className="mb-4 w-full">
      <TabsList className="text-foreground mx-auto mb-3 h-auto w-full max-w-2xl gap-2 rounded-none border-b bg-transparent px-0 py-1">
        <TabsTrigger
          value="tab-1"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <HouseIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
          <span className="hidden sm:block">Opis organizacije</span>
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <PhoneIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
          <span className="hidden sm:block">Kontakt informacije</span>
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <MessageCircleQuestionMarkIcon
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <span className="hidden sm:block">Pitanja</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tab-1" className="rounded-xl border p-8 shadow">
        {!organizer.description ? (
          <span className="text-muted-foreground flex w-full items-center justify-center text-center">
            Organizacija još uvek nema opis.
          </span>
        ) : (
          <div
            className="minimal-tiptap-content"
            dangerouslySetInnerHTML={{ __html: organizer.description }}
          />
        )}
      </TabsContent>

      <TabsContent value="tab-2" className="rounded-xl border p-8 shadow">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Kontakt informacije</h3>
            <p className="text-muted-foreground text-sm">
              Najbolji načini da stupite u kontakt sa organizacijom.
            </p>
          </div>

          {hasContactInfo ? (
            <div className="space-y-6">
              {contactDetails.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                    Primarni kontakti
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {contactDetails.map(item => (
                      <ContactRow key={item.label} {...item} />
                    ))}
                  </div>
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                    Društvene mreže
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {socialLinks.map(item => (
                      <ContactRow key={item.label} {...item} />
                    ))}
                  </div>
                </div>
              )}

              {financialLinks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                    Finansijske opcije
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {financialLinks.map(item => (
                      <ContactRow key={item.label} {...item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              Organizacija još uvek nije ostavila dodatne kontakt informacije.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="tab-3" className="rounded-xl border p-8 shadow">
        <AskOrganizerForm organizerId={organizer.userId} />
      </TabsContent>
    </Tabs>
  );
};

export default OrganizerTabs;
