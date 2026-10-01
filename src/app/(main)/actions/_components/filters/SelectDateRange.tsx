'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { srLatn } from 'date-fns/locale';

import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import useCustomSearchParams from '@/hooks/useSearchParams';
import { Label } from '@/components/ui/label';

const SelectDateRange = () => {
  const { setSearchParam, removeSearchParam, getSearchParam } = useCustomSearchParams();

  const dateFromParam = getSearchParam('dateFrom');
  const dateToParam = getSearchParam('dateTo');

  const parsedDateRange = useMemo<DateRange | undefined>(() => {
    const parseDate = (value: string | null) => {
      if (!value) return undefined;
      const [year, month, day] = value.split('-').map(Number);
      if (!year || !month || !day) return undefined;
      const date = new Date(year, month - 1, day);
      return Number.isNaN(date.getTime()) ? undefined : date;
    };

    const from = parseDate(dateFromParam);
    const to = parseDate(dateToParam);

    if (!from && !to) return undefined;

    if (!from && to) {
      return { from: to, to };
    }

    if (from && !to) {
      return { from };
    }

    if (from && to && from > to) {
      return { from: to, to: from };
    }

    return { from, to };
  }, [dateFromParam, dateToParam]);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(parsedDateRange);

  useEffect(() => {
    setDateRange(parsedDateRange);
  }, [parsedDateRange]);

  const formatDateParam = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const syncSearchParams = useCallback(
    (range: DateRange | undefined) => {
      const hasValidFrom = !!(range?.from && !Number.isNaN(range.from.getTime()));
      const hasValidTo = !!(range?.to && !Number.isNaN(range.to.getTime()));

      if (hasValidFrom && range?.from) {
        const formattedFrom = formatDateParam(range.from);
        if (formattedFrom !== dateFromParam) {
          setSearchParam('dateFrom', formattedFrom, { replace: true });
        }
      } else if (dateFromParam) {
        removeSearchParam('dateFrom', { replace: true });
      }

      if (hasValidTo && range?.to) {
        const formattedTo = formatDateParam(range.to);
        if (formattedTo !== dateToParam) {
          setSearchParam('dateTo', formattedTo, { replace: true });
        }
      } else if (dateToParam) {
        removeSearchParam('dateTo', { replace: true });
      }
    },
    [dateFromParam, dateToParam, formatDateParam, removeSearchParam, setSearchParam]
  );

  const handleSelect = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
      syncSearchParams(range);
    },
    [syncSearchParams]
  );

  const hasActiveRange = !!(dateRange?.from || dateRange?.to);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="date-range">U periodu od-do</Label>
        {hasActiveRange ? (
          <Button variant="ghost" size="sm" onClick={() => handleSelect(undefined)}>
            Poništi
          </Button>
        ) : null}
      </div>
      <Calendar
        mode="range"
        defaultMonth={dateRange?.from ?? dateRange?.to}
        selected={dateRange}
        onSelect={handleSelect}
        locale={srLatn}
        className="w-full rounded-lg border shadow-sm"
      />
    </div>
  );
};

export default SelectDateRange;
