import React from 'react';

import { BlogWithAuthor } from '@/types/blog.type';
import { PaginatedResponse } from '@/types/paginatedResponse.type';

import BlogCard from '@/components/blog/BlogCard';
import AlertCard from '@/components/global/AlertCard';
import BlogCardSkeleton from '@/components/blog/BlogCardSkeleton';

type BlogListProps = {
  data?: PaginatedResponse<BlogWithAuthor>;
  isLoading?: boolean;
  isError?: boolean;
};

const BlogsList = ({ data, isLoading, isError }: BlogListProps) => {
  if (isLoading)
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
    );

  if (isError)
    return <AlertCard title="Greška prilikom pribavljanja blogova" variant="destructive" />;

  if (!data || data.items.length === 0) return <AlertCard title="Nema pronađenih blogova" />;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {data.items.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogsList;
