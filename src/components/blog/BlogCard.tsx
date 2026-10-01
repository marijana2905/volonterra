'use client';

import Link from 'next/link';

import { formatRelativeTime } from '@/lib/utils';

import { BlogWithAuthor } from '@/types/blog.type';

import MyAvatar from '@/components/global/MyAvatar';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TagIcon } from 'lucide-react';
import { Badge } from '../ui/badge';

type BlogCardProps = {
  blog: BlogWithAuthor;
};

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm md:text-base">
          <Link
            href={`/volunteers/${blog.author?.username}`}
            className="group hover:text-primary flex items-center gap-4 transition-colors md:gap-2"
          >
            <MyAvatar
              className="size-8"
              imageUrl={blog.author?.image}
              fallbackText={blog.author?.name ? blog.author.name.trim().charAt(0) : ''}
            />
            <div className="flex flex-col">
              <span>{blog.author?.name}</span>
              <span className="text-xs md:hidden">
                {formatRelativeTime(new Date(blog.createdAt))}
              </span>
            </div>
          </Link>

          <span className="hidden md:block">•</span>

          <span className="hidden md:block">{formatRelativeTime(new Date(blog.createdAt))}</span>
        </div>

        <Link
          href={`/blogs/${blog.slug}`}
          className="hover:text-primary text-xl font-semibold tracking-tight transition-colors md:text-2xl"
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

      <CardFooter className="justify-between border-t">
        <div className="flex flex-wrap items-center gap-2">
          {blog.keywords.slice(0, 2).map((keyword, index) => (
            <Badge key={index} variant={'outline'}>
              <TagIcon /> {keyword}
            </Badge>
          ))}
          {blog.keywords.length > 2 && (
            <Badge variant={'outline'}>+{blog.keywords.length - 2}</Badge>
          )}
        </div>

        <Button variant={'outline'} size={'sm'} asChild>
          <Link href={`/blogs/${blog.slug}`}>
            Vidi više
            <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
