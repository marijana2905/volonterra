import { getVolunteerQuestions } from '@/data/organizer/getQuestions';

import { requireVolunteer } from '@/data/auth/requireVolunteer';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import AlertCard from '@/components/global/AlertCard';

import QuestionList from '../../_components/questions/QuestionList';

const VolunteerQuestionsPage = async () => {
  await requireVolunteer();

  const questions = await getVolunteerQuestions();

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Pitanja' }]} homeHref="/dashboard/vol/statistics" />

      <div className="flex flex-col gap-4 md:px-8">
        {questions.length === 0 ? (
          <AlertCard
            title="Nema pitanja"
            description="Ovde će biti prikazani razgovori vezani za pitanja koja postavite organizacijama."
          />
        ) : (
          <QuestionList questions={questions} />
        )}
      </div>
    </section>
  );
};

export default VolunteerQuestionsPage;
