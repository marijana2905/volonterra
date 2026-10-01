import React from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
};

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="mx-auto max-w-2xl space-y-2 py-4 text-center sm:space-y-4 sm:py-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
    </div>
  );
};

export default PageHeader;
