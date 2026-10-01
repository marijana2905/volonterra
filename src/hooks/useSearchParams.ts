import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type SetOptions = {
  replace?: boolean;
  scroll?: boolean;
};

const useCustomSearchParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParam = useCallback(
    (key: string, value: string, options?: SetOptions) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (params.get(key) === value) return;

      params.set(key, value);
      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      const method = options?.replace ? router.replace : router.push;
      method(url, { scroll: options?.scroll ?? false });
    },
    [pathname, router, searchParams],
  );

  const getSearchParam = useCallback(
    (key: string) => searchParams?.get(key) ?? null,
    [searchParams],
  );

  const removeSearchParam = useCallback(
    (key: string, options?: SetOptions) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (!params.has(key)) return;

      params.delete(key);
      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      const method = options?.replace ? router.replace : router.push;
      method(url, { scroll: options?.scroll ?? false });
    },
    [pathname, router, searchParams],
  );

  const removeAllSearchParams = useCallback(
    (options?: SetOptions) => {
      const url = pathname;
      const method = options?.replace ? router.replace : router.push;
      method(url, { scroll: options?.scroll ?? false });
    },
    [pathname, router],
  );

  return {
    setSearchParam,
    getSearchParam,
    removeSearchParam,
    removeAllSearchParams,
  };
};

export default useCustomSearchParams;
