'use client';

import * as motion from 'motion/react-client';
import TimelineSteps, { TimelineItemType } from '@/components/hero/TimelineSteps';
import GetStartedButton from './GetStartedButton';

const PartOfVolonTerra = () => {
  const steps: TimelineItemType[] = [
    {
      id: 1,
      title: 'Registruj se',
      description: 'Kreiraj nalog i pridruži se zajednici VolonTerra.',
      completed: false,
    },
    {
      id: 2,
      title: 'Izaberi svoj put',
      description:
        'Odaberi da li želiš da budeš volonter ili organizator i započni svoje angažovanje.',
      completed: false,
    },
    {
      id: 3,
      title: 'Izaberi ili kreiraj akcije',
      description:
        'Volonteri mogu da se prijave na akcije koje žele, dok organizatori mogu da kreiraju nove akcije i prate prijave.',
      completed: false,
    },
    {
      id: 4,
      title: 'Prati svoja dostignuća',
      description:
        'Volonteri dobijaju poene, bedževe i sertifikate nakon svake akcije. Organizatori imaju uvid u sve svoje akcije i angažovanje volontera.',
      completed: false,
    },
    {
      id: 5,
      title: 'Doprinesi očuvanju prirode',
      description: 'Uključi se i zajedno sa zajednicom čini svet boljim mestom – korak po korak.',
      completed: true,
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center py-16">
      <div className="mx-auto w-full max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-foreground mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
            Kako postati deo <span className="text-primary italic">VolonTerra?</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-base md:text-lg">
            Prati jednostavne korake i postani deo naše zajednice koja menja svet korak po korak!
          </p>
        </motion.div>

        <div className="mb-12 w-full">
          <TimelineSteps items={steps} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <GetStartedButton />
        </motion.div>
      </div>
    </section>
  );
};

export default PartOfVolonTerra;
