'use client';

import * as motion from 'motion/react-client';

const VolunteersIntro = () => {
  return (
    <section className="my-4 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-foreground mb-6 font-serif text-4xl leading-tight font-bold md:text-6xl"
        >
          Volonteri - <span className="text-primary italic">rang lista</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-muted-foreground text-md mx-auto mb-8 max-w-2xl md:text-lg"
        >
          Lista volontera rangirana po ukupnim radnim satima. Pogledajte ko je najaktivniji i
          uključite se da zajedno doprinosimo zaštiti prirode.
        </motion.p>
      </div>
    </section>
  );
};

export default VolunteersIntro;
