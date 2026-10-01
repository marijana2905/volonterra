import { usePagination } from '@/hooks/use-pagination';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import useCustomSearchParams from '@/hooks/useSearchParams';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay?: number;
};

const PaginationBar = ({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
}: PaginationProps) => {
  const { setSearchParam } = useCustomSearchParams();

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  });

  return (
    <Pagination className="my-4">
      <PaginationContent>
        {/* Previous page button */}
        <PaginationItem>
          <PaginationPrevious
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled={currentPage === 1 ? true : undefined}
            role={currentPage === 1 ? 'link' : undefined}
            onClick={
              currentPage === 1
                ? undefined
                : () => {
                    setSearchParam('page', (currentPage - 1).toString());
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
            }
          />
        </PaginationItem>

        {/* Left ellipsis (...) */}
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Page number links */}
        {pages.map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => {
                setSearchParam('page', page.toString());
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Right ellipsis (...) */}
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next page button */}
        <PaginationItem>
          <PaginationNext
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled={currentPage === totalPages ? true : undefined}
            role={currentPage === totalPages ? 'link' : undefined}
            onClick={
              currentPage === totalPages
                ? undefined
                : () => {
                    setSearchParam('page', (currentPage + 1).toString());
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationBar;
