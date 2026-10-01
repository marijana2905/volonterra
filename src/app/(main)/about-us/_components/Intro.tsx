import * as motion from 'motion/react-client';

const Intro = () => {
  const missionVision = [
    {
      title: 'Naša misija',
      description:
        'Inspirišemo i povezujemo ljude koji žele da učine dobro. Naša misija je da olakšamo pronalaženje i učešće u volonterskim akcijama, podržavajući organizacije i pojedince koji grade bolje društvo i zdraviju planetu.',
    },
    {
      title: 'Naša vizija',
      description:
        'Svet u kome je volontiranje deo svakodnevnog života — gde zajednice rastu kroz solidarnost, empatiju i brigu o prirodi. VolonTerra teži da postane pokret koji menja način na koji ljudi razmišljaju o pomoći drugima.',
    },
  ];

  return (
    <section className="flex items-center justify-center py-4 md:py-10">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-foreground mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
            Šta je zapravo <span className="text-primary italic">VolonTerra?</span>
          </h2>

          <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-base md:text-lg">
            Želiš da volontiraš, ali ne znaš gde da počneš ili ne možeš da pronađeš akcije koje ti
            zaista odgovaraju? <span className="text-primary font-medium">VolonTerra</span> je pravo
            mesto za tebe! Naša platforma povezuje ljude, organizacije i zajednice kroz volonterske
            akcije. Cilj nam je da svako lako pronađe priliku da pomogne — bilo da je reč o očuvanju
            prirode, humanitarnom radu ili edukativnim projektima. Verujemo da male akcije stvaraju
            velike promene.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {missionVision.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-muted/40 hover:bg-muted/60 rounded-2xl p-8 shadow-sm backdrop-blur-md transition-colors"
            >
              <h3 className="text-foreground mb-4 text-2xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Intro;
