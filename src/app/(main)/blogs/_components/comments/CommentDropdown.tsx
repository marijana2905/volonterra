'use client';

import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit3Icon, EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';
import { CommentWithAuthor } from '@/types/blog.type';
import YesNoAlertDialog from '@/components/global/YesNoAlertDialog';
import CustomDialog from '@/components/global/CustomDialog';
import CommentForm from './CommentForm';
import { deleteComment } from '@/actions/blog/deleteComment.action';
import { toast } from 'sonner';

type Props = {
  postId: string;
  comment: CommentWithAuthor;
};

const CommentDropdown = ({ postId, comment }: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="hover:text-primary cursor-pointer transition-colors">
          <EllipsisVerticalIcon size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setIsDropdownOpen(false);
              setIsEditOpen(true);
            }}
          >
            <Edit3Icon />
            Izmeni
          </DropdownMenuItem>

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

      {/** Delete Alert Dialog */}
      <YesNoAlertDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        variant="error"
        title="Brisanje komentara"
        description="Da li ste sigurni da želite da obrišete komentar? Ova akcija se ne može poništiti."
        confirmText="Da, obriši"
        loadingText="Brisanje..."
        cancelText="Otkaži"
        onConfirm={async () => {
          const { error } = await deleteComment(comment.id);

          if (error) {
            toast.error(error);
            return;
          }

          toast.success('Komentar je uspešno obrisan.');
          setIsDeleteOpen(false);
        }}
      />

      {/** Edit Alert Dialog */}
      <CustomDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        icon={Edit3Icon}
        title="Izmena komentara"
        children={
          <CommentForm
            postId={postId}
            comment={comment}
            onSubmitHandle={() => {
              setIsEditOpen(false);
            }}
          />
        }
      />
    </>
  );
};

export default CommentDropdown;
