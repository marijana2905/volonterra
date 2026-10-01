import { requireOrganizer } from '@/data/auth/requireOrganizer';
import { getQuestions } from '@/data/organizer/getQuestions';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import AlertCard from '@/components/global/AlertCard';

import QuestionList from '../../_components/questions/QuestionList';

const OrganizerQuestionsPage = async () => {
  await requireOrganizer();

  const questions = await getQuestions();

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Pitanja' }]} homeHref="/dashboard/org/statistics" />

      <div className="flex flex-col gap-4 md:px-8">
        {questions.length === 0 ? (
          <AlertCard
            title="Nema pitanja"
            description="Na pitanja koja Vam postave korisnici naše platforme moći ćete ovde da odgovorite."
          />
        ) : (
          <QuestionList questions={questions} />
        )}
      </div>
    </section>
  );
};

export default OrganizerQuestionsPage;
