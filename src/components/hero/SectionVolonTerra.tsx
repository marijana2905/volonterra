'use client';

import * as motion from 'motion/react-client';
import { HeartIcon, LeafIcon, UsersIcon, GlobeIcon, ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SectionVolonTerra = () => {
  return (
    <section className="bg-background flex flex-col items-center justify-center py-4">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-foreground mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
            Zašto <span className="text-primary italic">VolonTerra?</span>
          </h2>

          <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-base md:text-lg">
            Zato što želimo da volontiranje učinimo dostupnim, povezanim i smislenim. VolonTerra
            spaja ljude koji žele da menjaju svet – korak po korak.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <HeartIcon className="text-primary mx-auto mb-3 h-8 w-8" />,
              title: 'Pomažeš zajednici',
              text: 'Doprinesi lokalnim i globalnim akcijama koje čine razliku.',
            },
            {
              icon: <LeafIcon className="text-primary mx-auto mb-3 h-8 w-8" />,
              title: 'Brineš o prirodi',
              text: 'Učestvuj u ekološkim inicijativama i očuvanju životne sredine.',
            },
            {
              icon: <UsersIcon className="text-primary mx-auto mb-3 h-8 w-8" />,
              title: 'Povezuješ se',
              text: 'Upoznaj istomišljenike i zajedno pokrećite pozitivne promene.',
            },
            {
              icon: <GlobeIcon className="text-primary mx-auto mb-3 h-8 w-8" />,
              title: 'Postaješ deo pokreta',
              text: 'Volontiranje sa svrhom – za bolje društvo i održivu planetu.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {item.icon}
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <Button variant="link" className="mt-8" asChild>
        <Link href={'/about-us'}>
          O nama <ArrowRightIcon />
        </Link>
      </Button>
    </section>
  );
};

export default SectionVolonTerra;
