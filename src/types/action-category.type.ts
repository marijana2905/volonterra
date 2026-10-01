export type ActionCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ActionCategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  count: number;
};
