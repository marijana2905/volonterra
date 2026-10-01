import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import ContentWrapper from '@/components/global/ContentWrapper';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const keywordPlaceholders = Array.from({ length: 3 });
const paragraphPlaceholders = Array.from({ length: 6 });

export default function Loading() {
  return (
    <ContentWrapper>
      <div className="flex flex-col gap-4">
        <BreadcrumbWrapper
          homeHref="/"
          items={[
            { label: 'Eko Blog', href: '/blogs' },
            { label: '...', isLoading: true },
          ]}
        />

        <article className="flex flex-col gap-4">
          <header className="bg-muted/20 overflow-hidden rounded-3xl border shadow-sm">
            <div className="flex flex-col gap-6 p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-2">
                {keywordPlaceholders.map((_, index) => (
                  <Skeleton key={`keyword-${index}`} className="h-7 w-20 rounded-full" />
                ))}
              </div>

              <div className="flex-1 space-y-4">
                <Skeleton className="h-12 w-3/4 rounded-lg" />

                <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>

                  <span>•</span>

                  <Skeleton className="h-4 w-28" />

                  <span>•</span>

                  <Skeleton className="h-4 w-24" />

                  <span className="ml-auto">
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </span>
                </div>
              </div>
            </div>
          </header>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(240px,320px)]">
            <div className="bg-background/80 rounded-3xl border p-6 shadow">
              <div className="space-y-4">
                {paragraphPlaceholders.map((_, index) => (
                  <Skeleton
                    key={`paragraph-${index}`}
                    className={`h-4 ${index % 3 === 0 ? 'w-full' : index % 3 === 1 ? 'w-11/12' : 'w-4/5'}`}
                  />
                ))}
              </div>
            </div>

            <aside className="flex flex-col gap-6">
              <div className="bg-muted/50 rounded-3xl border p-6 shadow-sm">
                <Skeleton className="h-5 w-32" />

                <Separator className="my-4" />

                <dl className="space-y-3 text-sm">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={`detail-${index}`} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </dl>
              </div>

              <div className="bg-muted/50 rounded-3xl border p-6 shadow-sm">
                <Skeleton className="h-5 w-24" />
                <Separator className="my-4" />
                <div className="flex flex-wrap gap-2">
                  {keywordPlaceholders.map((_, index) => (
                    <Skeleton key={`aside-keyword-${index}`} className="h-7 w-16 rounded-full" />
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </article>
      </div>
    </ContentWrapper>
  );
}
