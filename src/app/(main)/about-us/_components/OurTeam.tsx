'use client';

import * as motion from 'motion/react-client';

const teamMembers = [
  {
    image: '/aleksandar.jpg',
    name: 'Aleksandar Gospavić',
    role: 'Vođa tima',
  },
  {
    image: '/marijana.jpg',
    name: 'Marijana Rančić',
    role: 'Član tima za razvoj',
  },
  {
    image: '/jovan.jpg',
    name: 'Jovan Bogdanović',
    role: 'Član tima za razvoj',
  },
];

const OurTeam = () => {
  return (
    <section className="bg-background flex flex-col items-center justify-center py-10">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-foreground mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
            Naš <span className="text-primary italic">tim</span>
          </h2>

          <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-base md:text-lg">
            Tim predanih i motivisanih studenata koji je zajedničkim radom razvio projekat{' '}
            <span className="text-primary font-semibold">VolonTerra</span>.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-card flex flex-col items-center rounded-2xl border p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={member.image}
                alt={member.name}
                className="mb-4 h-40 w-40 rounded-full object-cover shadow-md"
              />
              <h3 className="text-foreground mb-1 text-lg font-semibold">{member.name}</h3>
              <p className="text-primary mb-2 text-sm italic">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
