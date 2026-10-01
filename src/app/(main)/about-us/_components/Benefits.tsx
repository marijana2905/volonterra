'use client';

import * as motion from 'motion/react-client';
import { Leaf, Users, Medal, Sparkles, HeartHandshake, Globe, Star } from 'lucide-react';
import BenefitBox from './BenefitBox';

const Benefits = () => {
  const benefitPositions = [
    {
      col: 1,
      row: 1,
      icon: <Leaf className="text-primary h-10 w-10" />,
      label: 'Očuvanje prirode',
    },
    {
      col: 7,
      row: 1,
      icon: <Users className="text-primary h-10 w-10" />,
      label: 'Nova prijateljstva',
    },
    {
      col: 2,
      row: 2,
      icon: <Sparkles className="text-primary h-10 w-10" />,
      label: 'Lični razvoj i timski duh',
    },
    {
      col: 6,
      row: 2,
      icon: <Medal className="text-primary h-10 w-10" />,
      label: 'Sertifikati i bedževi',
    },
    {
      col: 3,
      row: 3,
      icon: <HeartHandshake className="text-primary h-10 w-10" />,
      label: 'Zajedništvo i saradnja',
    },
    {
      col: 5,
      row: 3,
      icon: <Globe className="text-primary h-10 w-10" />,
      label: 'Globalna povezanost',
    },
    {
      col: 4,
      row: 4,
      icon: <Star className="text-primary h-10 w-10" />,
      label: 'Inspiracija i motivacija',
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center py-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-foreground mb-12 text-center font-serif text-4xl font-bold md:text-5xl"
      >
        Šta dobijaš kada postaneš deo <span className="text-primary italic">VolonTerre?</span>
      </motion.h2>

      <div className="relative hidden max-w-5xl grid-cols-7 grid-rows-4 gap-5 lg:grid">
        {benefitPositions.map((b, i) => (
          <BenefitBox
            key={i}
            icon={b.icon}
            label={b.label}
            index={i}
            col={b.col.toString()}
            row={b.row.toString()}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute top-0 left-1/2 flex h-[calc(2*9rem+1.5rem)] -translate-x-1/2 items-start justify-center"
        >
          <img
            src="/logo_without_text.png"
            alt="VolonTerra"
            className="h-full w-auto object-contain"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6 px-6 md:grid-cols-3 lg:hidden">
        {benefitPositions.map((b, i) => (
          <BenefitBox
            key={i}
            icon={b.icon}
            label={b.label}
            index={i}
            col=""
            row=""
            className={i === 6 ? 'hidden sm:block' : ''}
          />
        ))}
      </div>
    </section>
  );
};

export default Benefits;
