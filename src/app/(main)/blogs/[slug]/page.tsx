import { formatDate, formatRelativeTime } from '@/lib/utils';

import { getBlogBySlug } from '@/data/blog/getBlogBySlug';

import { CalendarIcon, ClockIcon, MessageSquareIcon, TagIcon } from 'lucide-react';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import ContentWrapper from '@/components/global/ContentWrapper';
import MyAvatar from '@/components/global/MyAvatar';
import { BlogActions } from '@/components/blog/BlogActions';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import NotFound from './not-found';
import Link from 'next/link';
import CommentForm from '../_components/comments/CommentForm';
import { getUserSession } from '@/data/auth/getUserSession';
import AlertCard from '@/components/global/AlertCard';
import CommentsList from '../_components/comments/CommentsList';
import { CommentWithAuthor } from '@/types/blog.type';

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return { title: 'Članak nije pronađen' };
  }
  
  return {
    title: blog.title,
    openGraph: {
      title: blog.title,
    },
  };
}

const BlogDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  const session = await getUserSession();

  if (!blog) return NotFound();
  if (blog.isBanned && (!session || session.user.role !== 'ADMIN')) return NotFound();

  const authorName = blog.author?.name ?? 'Nepoznat autor';
  const cleanContent = blog.content.replace(/<[^>]+>/g, ' ');
  const wordCount = cleanContent.trim() ? cleanContent.trim().split(/\s+/).length : 0;

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const keywords = blog.keywords?.filter(Boolean) ?? [];

  // Grupisi komentare
  const commentsByParentId = {} as Record<string, CommentWithAuthor[]>;

  blog.comments.forEach(comment => {
    const key = comment.parentId ?? '';

    if (!commentsByParentId[key]) {
      commentsByParentId[key] = [];
    }

    // Normalize to CommentWithAuthor by ensuring `parent` exists (fallback to null)
    const typedComment = {
      ...(comment as any),
      parent: (comment as any).parent ?? null,
    } as CommentWithAuthor;

    commentsByParentId[key].push(typedComment);
  });

  // Komentari koji su na vrhu (bez roditelja)
  const topLevelComments = commentsByParentId[''] || [];

  return (
    <ContentWrapper>
      <div className="flex flex-col gap-4">
        <BreadcrumbWrapper
          homeHref="/"
          items={[{ label: 'Eko Blog', href: '/blogs' }, { label: blog.title }]}
        />

        <article className="flex flex-col gap-4">
          <header className="bg-muted/20 overflow-hidden rounded-md border shadow-sm">
            <div className="flex flex-col gap-6 p-6 md:p-10">
              {keywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {keywords.map(keyword => (
                    <Badge key={keyword} variant="outline">
                      <TagIcon /> {keyword}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex-1 space-y-4">
                <h1 className="text-3xl leading-tight font-bold text-balance md:text-4xl">
                  {blog.title}
                </h1>

                <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                  <Link
                    href={`/volunteers/${blog.author?.username}`}
                    className="text-foreground hover:text-primary flex items-center gap-3 transition-colors"
                  >
                    <MyAvatar
                      imageUrl={blog.author?.image}
                      fallbackText={authorName}
                      className="h-9 w-9 text-sm"
                    />
                    <span className="font-medium">{authorName}</span>
                  </Link>

                  <span>•</span>

                  <span className="flex items-center gap-2">
                    <CalendarIcon size={18} /> {formatRelativeTime(blog.createdAt)}
                  </span>

                  <span>•</span>

                  <span className="flex items-center gap-2">
                    <ClockIcon size={18} /> {readingTime} min čitanja
                  </span>

                  <span className="ml-auto">
                    <BlogActions blog={blog} />
                  </span>
                </div>
              </div>
            </div>
          </header>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(240px,320px)]">
            <div className="flex flex-col gap-4">
              {/* Blog Content */}
              <div className="bg-card rounded-md border p-6 shadow">
                <div className="minimal-tiptap-content">
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
              </div>

              {/* Comments */}
              <div className="bg-muted/20 space-y-4 rounded-md p-6 shadow">
                <span className="flex items-center gap-2">
                  <MessageSquareIcon size={18} /> Komentari ({blog.comments.length}):
                </span>

                <Separator className="my-4" />

                {session && <CommentForm postId={blog.id} />}

                {blog.comments.length > 0 ? (
                  <CommentsList
                    userId={session?.user.id}
                    postId={blog.id}
                    comments={topLevelComments}
                    commentsByParentId={commentsByParentId}
                  />
                ) : (
                  <AlertCard title="Nema komentara za ovaj blog." />
                )}
              </div>
            </div>

            {/* Right side */}
            <aside className="flex flex-col gap-6">
              <div className="bg-muted/20 rounded-md border p-6 shadow-sm">
                <h2 className="">Detalji članka</h2>

                <Separator className="my-4" />

                <dl className="text-muted-foreground space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt>Objavljeno</dt>
                    <dd className="text-foreground">{formatDate(blog.createdAt)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>Broj reči</dt>
                    <dd className="text-foreground">{wordCount || '—'}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>Prosečno vreme čitanja</dt>
                    <dd className="text-foreground">{readingTime} min</dd>
                  </div>
                </dl>
              </div>

              {keywords.length > 0 && (
                <div className="bg-muted/20 rounded-md border p-6 shadow-sm">
                  <h2>Ključne reči</h2>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-2">
                    {keywords.map(keyword => (
                      <Badge key={`aside-${keyword}`} variant="outline">
                        <TagIcon />
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </section>
        </article>
      </div>
    </ContentWrapper>
  );
};

export default BlogDetailPage;
