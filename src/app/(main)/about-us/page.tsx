import ContentWrapper from '@/components/global/ContentWrapper';
import Intro from './_components/Intro';
import Benefits from './_components/Benefits';
import OurTeam from './_components/OurTeam';

export const metadata = {
  title: 'O nama',
  description:
    'Saznajte više o VolonTerra timu i našoj misiji povezivanja volontera i organizacija.',
};

const AboutPage = async () => {
  return (
    <ContentWrapper className="mb-16 flex flex-col gap-16">
      <Intro />
      <Benefits />
      <OurTeam />
    </ContentWrapper>
  );
};

export default AboutPage;
