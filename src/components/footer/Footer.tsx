import Logo from '@/components/global/Logo';
import { Leaf, ArrowRightIcon, Mail, MapPin, User, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Copyright from '@/components/footer/Copyright';
import { getRecentActions } from '@/data/footer/getRecentActions';
import { getTopOrganizations } from '@/data/footer/getTopOrganizations';

type Organizer = {
  organizationName: string;
  user: {
    username: string;
  };
};

const contactInfo = [
  { name: 'volonterra@outlook.com', href: 'mailto:volonterra@outlook.com', icon: Mail },
  { name: 'Niš, 18000', href: 'https://www.google.com/maps/search/Ni%C5%A1+18000', icon: MapPin },
];

const quickLinks = [
  { name: 'Akcije', href: '/actions' },
  { name: 'Organizacije', href: '/organizations' },
  { name: 'Volonteri', href: '/volunteers' },
  { name: 'Eko Blog', href: '/blogs' },
];

const Footer = async () => {
  const recentActions = await getRecentActions();
  const topOrganizers: Organizer[] = (await getTopOrganizations()).filter(
    (org): org is Organizer => org.user.username !== null && org.user.username !== undefined,
  );

  return (
    <footer className="bg-muted/50 border-border/50 border-t">
      <div className="mx-auto max-w-screen-xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo width={160} height={35} type="icon-text" />
            <p className="text-muted-foreground mt-3 mb-4 text-sm leading-relaxed">
              Zajedno činimo svet boljim mestom. VolonTerra okuplja ljude spremne da pomognu svojoj
              zajednici i prirodi.
            </p>
            <div className="flex flex-col items-start">
              <h4 className="text-foreground mb-2 font-semibold">Kontakt</h4>
              <ul className="space-y-2 text-sm">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={index} className="flex items-center gap-2">
                      <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="text-foreground mb-3 font-semibold">Najnovije akcije</h4>
            <ul className="space-y-2">
              {recentActions.length > 0 ? (
                recentActions.map((action) => (
                  <li key={action.slug} className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 shrink-0 text-green-600" />
                    <Link
                      href={`/actions/${action.slug}`}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {action.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground text-sm">Nema dostupnih akcija</li>
              )}
            </ul>

            <div className="mt-3 self-start">
              <Button
                variant="link"
                className="inline-flex h-auto items-center gap-1 p-0 text-sm"
                asChild
              >
                <Link href="/actions">
                  Pogledaj sve akcije <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="text-foreground mb-3 font-semibold">Top organizacije</h4>
            <ul className="space-y-2">
              {topOrganizers.length > 0 ? (
                topOrganizers.map((org) => (
                  <li key={org.user.username} className="flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0 text-green-600" />
                    <Link
                      href={`/organizations/${org.user.username}`}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {org.organizationName}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground text-sm">Nema organizacija</li>
              )}
            </ul>

            <div className="mt-3 self-start">
              <Button
                variant="link"
                className="inline-flex h-auto items-center gap-1 p-0 text-sm"
                asChild
              >
                <Link href="/organizations">
                  Pogledaj sve organizacije <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="text-foreground mb-3 font-semibold">Linkovi</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name} className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 shrink-0 text-green-600" />
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-between">
          <Button variant="link" className="inline-flex items-center gap-1 p-0 text-sm" asChild>
            <Link href="/about-us">O platformi VolonTerra</Link>
          </Button>
          <Button variant="link" className="inline-flex items-center gap-1 p-0 text-sm" asChild>
            <Link href="/privacy">Pravila privatnosti</Link>
          </Button>
        </div>

        <div className="border-border/50 text-muted-foreground mt-4 flex flex-col items-center justify-center gap-2 border-t pt-4 text-center text-xs md:flex-row md:justify-between">
          <Copyright />
          <span>Powered by Neviđeni.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
