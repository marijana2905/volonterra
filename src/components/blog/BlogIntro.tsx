'use client';

import * as motion from 'motion/react-client';

const BlogIntro = () => {
  return (
    <section className="my-4 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-foreground mb-6 font-serif text-4xl leading-tight font-bold md:text-6xl"
        >
          Dobrodošli na <span className="text-primary italic">Eko blog</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-muted-foreground text-md mx-auto mb-8 max-w-2xl md:text-lg"
        >
          Mesto gde delimo priče, ideje i inspiraciju o ekologiji i volonterizmu. Pišite, učite i
          zajedno gradimo održivu budućnost. 🌱
        </motion.p>
      </div>
    </section>
  );
};

export default BlogIntro;
