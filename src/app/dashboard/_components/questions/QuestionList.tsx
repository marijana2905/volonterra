'use client';

import { useMemo, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import AlertCard from '@/components/global/AlertCard';
import { Input } from '@/components/ui/input';

import QuestionCard from './QuestionCard';

import { QuestionWithMessages } from '@/types/question.type';
import { SearchIcon, XIcon } from 'lucide-react';

const QuestionList = ({ questions }: { questions: QuestionWithMessages[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const filteredQuestions = useMemo(() => {
    const normalizedQuery = debouncedSearchTerm.trim().toLowerCase();

    if (!normalizedQuery) {
      return questions;
    }

    return questions.filter(question => {
      const title = question.title ?? '';
      const senderDisplayName = question.user?.name ?? question.email ?? 'Anonimni korisnik';
      const normalizedSender = senderDisplayName.toLowerCase();

      return (
        title.toLowerCase().includes(normalizedQuery) || normalizedSender.includes(normalizedQuery)
      );
    });
  }, [debouncedSearchTerm, questions]);

  const hasNoResults = filteredQuestions.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Input
          type="search"
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          placeholder="Pretraži pitanja"
          className="px-9"
        />

        <SearchIcon className="text-muted-foreground/60 absolute top-2 left-2" size={20} />
        {searchTerm && (
          <XIcon
            className="text-muted-foreground/60 absolute top-2 right-2"
            size={20}
            onClick={() => setSearchTerm('')}
          />
        )}
      </div>

      {hasNoResults ? (
        <AlertCard
          title="Nema rezultata"
          description="Ne postoje razgovori koji odgovaraju unetom pojmu."
        />
      ) : (
        filteredQuestions.map(question => <QuestionCard key={question.id} question={question} />)
      )}
    </div>
  );
};

export default QuestionList;
