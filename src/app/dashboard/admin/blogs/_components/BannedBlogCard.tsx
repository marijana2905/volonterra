'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { formatRelativeTime } from '@/lib/utils';
import { BlogWithAuthor } from '@/types/blog.type';
import MyAvatar from '@/components/global/MyAvatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { toggleBannedPost } from '@/actions/blog/toggleBannedPost';
import { useQueryClient } from '@tanstack/react-query';

type BannedBlogCardProps = {
  blog: BlogWithAuthor;
};

export default function BannedBlogCard({ blog }: BannedBlogCardProps) {
  const [isPending, startTransition] = useTransition();

  const queryClient = useQueryClient();
  const handleUnban = () => {
    startTransition(async () => {
      const res = await toggleBannedPost(blog.id, false);

      if (res?.error) {
        toast.error(res.error);
      } else {
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
        toast.success('Blog je ponovo vidljiv korisnicima!');
      }
    });
  };

  return (
    <Card className="border-destructive flex">
      <CardHeader className="flex-1 flex-col gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/volunteers/${blog.author?.username}`}
            className="group hover:text-primary flex items-center gap-2 transition-colors"
          >
            <MyAvatar
              className="size-8"
              imageUrl={blog.author?.image}
              fallbackText={blog.author?.name ? blog.author.name.trim().charAt(0) : ''}
            />
            <span>{blog.author?.name}</span>
          </Link>

          <span>•</span>

          <span>{formatRelativeTime(new Date(blog.createdAt))}</span>
        </div>

        <Link
          href={`/blogs/${blog.slug}`}
          className="hover:text-primary text-2xl font-semibold tracking-tight transition-colors"
        >
          {blog.title}
        </Link>
      </CardHeader>

      <CardContent className="flex-1">
        <div
          className="text-muted-foreground line-clamp-3"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </CardContent>

      <CardFooter className="mt-auto justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleUnban}
          disabled={isPending}
          className="transform transition-transform duration-200 hover:scale-105"
        >
          {isPending ? 'Obnavljam...' : 'Prikaži sadržaj'}
        </Button>
      </CardFooter>
    </Card>
  );
}
