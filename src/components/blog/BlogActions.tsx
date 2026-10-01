'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { Post } from '@prisma/types';

import { deleteBlog } from '@/actions/blog/deleteBlog';
import { toggleBannedPost } from '@/actions/blog/toggleBannedPost';

import CustomDialog from '@/components/global/CustomDialog';
import BlogForm from '@/app/(main)/blogs/_components/BlogForm';
import YesNoAlertDialog from '@/components/global/YesNoAlertDialog';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Ban, Edit2Icon, MoreVertical, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

type BlogActionsProps = {
  blog: Post;
};

export function BlogActions({ blog }: BlogActionsProps) {
  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const canEditOrDelete =
    blog.authorId === session.data?.user.id || session.data?.user.role === 'ADMIN';

  const canBanOrUnban = session.data?.user.role === 'ADMIN';

  if (!canEditOrDelete) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreVertical className="hover:text-primary cursor-pointer transition-colors" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit2Icon /> Izmeni
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} variant="destructive">
            <Trash2Icon /> Obriši
          </DropdownMenuItem>

          {canBanOrUnban && (
            <DropdownMenuItem
              onClick={async () => {
                const newStatus = !blog.isBanned;
                const res = await toggleBannedPost(blog.id, newStatus);

                if (res.error) {
                  toast.error(res.error);
                  return;
                }

                toast.success(
                  newStatus ? 'Blog je označen kao nepoželjan.' : 'Blog je ponovo vidljiv.',
                );

                queryClient.invalidateQueries({ queryKey: ['blogs'] });
                router.replace('/blogs');
              }}
              variant="destructive"
            >
              <Ban /> {blog.isBanned ? 'Prikaži sadržaj bloga' : 'Označi kao nepoželjno'}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit blog form */}
      <CustomDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        title="Izmeni blog"
        description="Izmeni informacije o blogu"
      >
        <BlogForm blog={blog} onSuccess={() => setIsEditDialogOpen(false)} />
      </CustomDialog>

      {/* Delete blog dialog */}
      <YesNoAlertDialog
        variant="error"
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        title="Obriši blog"
        description="Da li ste sigurni da želite da obrišete ovaj blog? Ova akcija je nepovratna."
        confirmText="Da, obriši"
        cancelText="Otkaži"
        onConfirm={async () => {
          const { error } = await deleteBlog(blog.id);

          if (error) {
            toast.error(error);
            return;
          }

          toast.success('Uspešno obrisan blog');
          queryClient.invalidateQueries({ queryKey: ['blogs'] });
          router.replace('/blogs');
        }}
      />
    </>
  );
}
