'use client';

import * as motion from 'motion/react-client';
import GetStartedButton from './GetStartedButton';
import { UsersIcon, BuildingIcon, CheckCircleIcon, MapPinIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type HeroSectionProps = {
  totalVolunteers: number;
  totalOrganizations: number;
  totalCompletedActions: number;
  totalCities: number;
};

const HeroSection = ({
  totalVolunteers,
  totalOrganizations,
  totalCompletedActions,
  totalCities,
}: HeroSectionProps) => {
  const [volunteers, setVolunteers] = useState(0);
  const [organizations, setOrganizations] = useState(0);
  const [actions, setActions] = useState(0);
  const [cities, setCities] = useState(0);

  useEffect(() => {
    const animateValue = (setter: (n: number) => void, end: number, duration: number) => {
      let start = 0;
      const intervalTime = 30;
      const steps = Math.ceil(duration / intervalTime);
      const stepValue = Math.max(Math.floor((end - start) / steps), 1);

      const interval = setInterval(() => {
        start += stepValue;
        if (start >= end) {
          start = end;
          clearInterval(interval);
        }
        setter(start);
      }, intervalTime);
    };

    animateValue(setVolunteers, totalVolunteers, 2500);
    animateValue(setOrganizations, totalOrganizations, 2500);
    animateValue(setActions, totalCompletedActions, 2500);
    animateValue(setCities, totalCities, 2500);
  }, [totalVolunteers, totalOrganizations, totalCompletedActions, totalCities]);

  const stats = [
    {
      icon: <UsersIcon className="text-primary mx-auto mb-2 h-8 w-8" />,
      value: volunteers,
      label: 'Aktivnih volontera',
    },
    {
      icon: <BuildingIcon className="text-primary mx-auto mb-2 h-8 w-8" />,
      value: organizations,
      label: 'Organizacija u saradnji',
    },
    {
      icon: <CheckCircleIcon className="text-primary mx-auto mb-2 h-8 w-8" />,
      value: actions,
      label: 'Realizovanih akcija',
    },
    {
      icon: <MapPinIcon className="text-primary mx-auto mb-2 h-8 w-8" />,
      value: cities,
      label: 'Gradova širom Srbije',
    },
  ];

  return (
    <section className="flex items-center justify-center py-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-foreground mb-6 font-serif text-4xl leading-tight font-bold md:text-6xl lg:text-7xl">
            Budi glas <span className="text-primary italic">prirode</span>
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl text-base md:text-lg">
            Moderna platforma koja povezuje volontere i organizacije, olakšavajući pronalazak
            ekoloških i humanitarnih akcija. Zajedno pokrećemo akcije, gradimo svest i činimo dobro
            – korak po korak.
          </p>
          <GetStartedButton />

          <div className="mt-12 grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col gap-2"
              >
                {stat.icon}
                <div className="text-foreground text-3xl font-semibold">{stat.value}+</div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden justify-self-end lg:block"
        >
          <div className="relative h-96 w-96">
            <img
              src="/pozadinska.jpg"
              alt="Pozadinska"
              className="absolute inset-0 h-full w-full rounded-2xl object-cover shadow-2xl"
            />
            <div className="from-primary/20 to-secondary/20 absolute inset-0 rounded-2xl bg-gradient-to-tl mix-blend-overlay"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
