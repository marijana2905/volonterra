'use client';

import { useFormContext } from 'react-hook-form';
import { useMemo } from 'react';
import { srLatn } from 'date-fns/locale';
import { Step3Values } from '@/schemas/actionSchema';
import AlertCard from '@/components/global/AlertCard';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TimeCalendar = () => {
  const form = useFormContext<Step3Values>();

  // Moguce je zakazati akciju tek sutra
  const disableBeforeToday = (date: Date) => {
    const now = new Date();
    const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h unapred
    return date < minDate;
  };

  // Normalizacija datuma da bude u podne lokalnog vremena
  const normalizeDate = (date: Date): Date => {
    const normalized = new Date(date);
    normalized.setHours(12, 0, 0, 0);
    return normalized;
  };

  // Memoizacija vremenskih opcija
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const value = `${formattedHour}:${formattedMinute}`;
        const label = value;
        options.push({ value, label });
      }
    }
    return options;
  }, []);

  return (
    <>
      <div className="flex flex-col items-start gap-8 md:flex-row">
        <div className="flex w-full flex-col gap-2 md:w-2/3 lg:items-start">
          <FormLabel>Datum:</FormLabel>
          <div className="flex w-full items-center justify-center rounded-lg border p-4">
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <Calendar
                      mode="range"
                      selected={field.value}
                      onSelect={selectedDateRange => {
                        if (selectedDateRange?.from) {
                          const normalizedFrom = normalizeDate(selectedDateRange.from);
                          let normalizedTo = selectedDateRange.to;
                          if (normalizedTo) {
                            normalizedTo = normalizeDate(normalizedTo);
                          }
                          field.onChange({ from: normalizedFrom, to: normalizedTo });
                        }
                      }}
                      className="bg-transparent p-0 [--cell-size:--spacing(10.5)]"
                      disabled={disableBeforeToday}
                      locale={srLatn}
                      defaultMonth={field.value?.from || new Date()}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 md:w-1/3">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Vreme početka:</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={value => {
                      field.onChange(value);

                      // Resetuj endTime ako je pre novog startTime
                      const currentEndTime = form.getValues('endTime');
                      if (currentEndTime && currentEndTime < value) {
                        form.setValue('endTime', ''); // prazan string umesto undefined
                      }
                    }}
                  >
                    <SelectTrigger id="start-time">
                      <SelectValue placeholder="hh:mm" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px] overflow-auto">
                      {timeOptions.map(option => (
                        <SelectItem key={option.value + 'startTime'} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Očekivano vreme završetka:</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={value => {
                      const startTime = form.getValues('startTime');
                      if (!startTime || value >= startTime) {
                        field.onChange(value);
                      } else {
                        field.onChange(''); // reset ako je pre startTime
                      }
                    }}
                  >
                    <SelectTrigger id="end-time">
                      <SelectValue placeholder="hh:mm" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px] overflow-auto">
                      {timeOptions.map(option => (
                        <SelectItem key={option.value + 'endTime'} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <AlertCard title="Napomena:" description="Akciju je moguće zakazati najmanje 24h unapred." />
    </>
  );
};

export default TimeCalendar;
