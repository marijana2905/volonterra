'use client';

import { useState } from 'react';

import { deleteQuestionAction } from '@/actions/question/deleteQuestion.action';

import YesNoAlertDialog from '@/components/global/YesNoAlertDialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MessageCircleIcon,
  MessageCircleOffIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from 'lucide-react';

import { toast } from 'sonner';
import { endQuestionAction } from '@/actions/question/endQuestion.action';
import { continueQuestionAction } from '@/actions/question/continueQuestion.action';

type QuestionCardDropdown = {
  questionId: string;
  isConversationEnded: boolean;
};

const QuestionCardDropdown = ({ questionId, isConversationEnded }: QuestionCardDropdown) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEndConversationOpen, setIsEndConversationOpen] = useState(false);
  const [isReopenConversationOpen, setIsReopenConversationOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="cursor-pointer">
          <MoreVerticalIcon className="hover:text-primary" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isConversationEnded ? (
            <DropdownMenuItem
              onClick={() => {
                setIsDropdownOpen(false);
                setIsEndConversationOpen(true);
              }}
            >
              <MessageCircleOffIcon className="hover:text-primary" />
              Završi razgovor
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                setIsDropdownOpen(false);
                setIsReopenConversationOpen(true);
              }}
            >
              <MessageCircleIcon className="hover:text-primary" />
              Otvori razgovor
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setIsDropdownOpen(false);
              setIsDeleteOpen(true);
            }}
          >
            <Trash2Icon />
            Obriši
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Alert Dialog */}
      <YesNoAlertDialog
        variant="error"
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Brisanje pitanja"
        description="Ceo razgovor će biti trajno obrisan i ne može se povratiti. Da li ste sigurni da želite da obrišete ovo pitanje?"
        confirmText="Da, obriši"
        cancelText="Odustani"
        loadingText="Brisanje"
        onConfirm={async () => {
          const { error } = await deleteQuestionAction(questionId);

          if (error) {
            toast.error(error);
            return;
          }

          toast.success('Pitanje je uspešno obrisano.');
        }}
      />

      {/* End conversation Alert Dialog */}
      <YesNoAlertDialog
        isOpen={isEndConversationOpen}
        setIsOpen={setIsEndConversationOpen}
        title="Završavanje razgovora"
        description="Nakon završetka, neće biti moguće slati ili primati nove poruke u ovom razgovoru. Da li ste sigurni da želite da završite ovaj razgovor?"
        confirmText="Da, završi"
        cancelText="Odustani"
        onConfirm={async () => {
          const { error } = await endQuestionAction(questionId);

          if (error) {
            toast.error(error);
            return;
          }

          toast.success('Razgovor je uspešno završen.');
        }}
      />

      {/* Reopen conversation Alert Dialog */}
      <YesNoAlertDialog
        isOpen={isReopenConversationOpen}
        setIsOpen={setIsReopenConversationOpen}
        title="Otvaranje razgovora"
        description="Nakon otvaranja, biće moguće ponovo slati i primati poruke u ovom razgovoru. Da li ste sigurni da želite da otvorite ovaj razgovor?"
        confirmText="Da, otvori"
        cancelText="Odustani"
        onConfirm={async () => {
          const { error } = await continueQuestionAction(questionId);

          if (error) {
            toast.error(error);
            return;
          }

          toast.success('Razgovor je uspešno nastavljen.');
        }}
      />
    </>
  );
};

export default QuestionCardDropdown;
