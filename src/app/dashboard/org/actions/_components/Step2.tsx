'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema, Step2Values } from '@/schemas/actionSchema';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CityCombobox } from './CityCombobox';
import LocationPickerWrapper from './map/LocationPickerWrapper';
import { toast } from 'sonner';

type Props = {
  defaultValues: Omit<Step2Values, 'latitude' | 'longitude'> & {
    latitude?: number;
    longitude?: number;
  };
  onSubmit: (data: Step2Values) => void;
  onBack: (data: Step2Values) => void;
  currentCenter: [number, number];
  setCurrentCenter: (center: [number, number]) => void;
  currentZoom: number;
  setCurrentZoom: (zoom: number) => void;
};
const Step2 = ({
  defaultValues,
  onSubmit,
  onBack,
  currentCenter,
  setCurrentCenter,
  currentZoom,
  setCurrentZoom,
}: Props) => {
  const form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues,
  });

  const latitude = form.watch('latitude');
  const longitude = form.watch('longitude');
  const city = form.watch('city');

  // Validacija forme kada se komponenta učita sa postojećim koordinatama
  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      form.trigger(['latitude', 'longitude']);
    }
  }, [form, latitude, longitude]);

  // Kada korisnik izabere grad, automatski centriraj i zumiraj mapu na taj grad
  useEffect(() => {
    const fetchCityPosition = async () => {
      if (!city || city.trim().length === 0) return;
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          city
        )}`;
        const res = await fetch(url, {
          headers: {
            Accept: 'application/json',
          },
        });
        if (!res.ok) return;
        const data: Array<{ lat: string; lon: string }> = await res.json();
        const first = data?.[0];
        if (first) {
          const lat = parseFloat(first.lat);
          const lon = parseFloat(first.lon);
          if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
            setCurrentCenter([lat, lon]);
            setCurrentZoom(11);
          }
        }
      } catch (e) {
        toast.error('Greška pri dohvatanju lokacije grada.');
      }
    };

    fetchCityPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="flex flex-col items-start justify-center gap-4 md:flex-row">
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full md:w-1/3">
                  <FormLabel>Grad</FormLabel>
                  <FormControl>
                    <CityCombobox
                      value={field.value}
                      onChange={value => {
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Izaberite najbliži grad.</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full md:w-2/3">
                  <FormLabel>Lokacija</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Dodatni opis lokacije. Npr. "Park u centru grada", "Trg Republike"
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <div className="bg-muted/20 flex flex-col justify-center rounded-xl border text-center">
            <LocationPickerWrapper
              markerPosition={
                latitude !== undefined && longitude !== undefined
                  ? {
                      lat: latitude,
                      lng: longitude,
                    }
                  : undefined
              }
              onMarkerPositionChange={async position => {
                form.setValue('latitude', position.lat);
                form.setValue('longitude', position.lng);
                // Pokreni re-validaciju forme nakon postavljanja markera
                await form.trigger(['latitude', 'longitude']);
              }}
              currentCenter={currentCenter}
              setCurrentCenter={setCurrentCenter}
              zoom={currentZoom}
              setCurrentZoom={setCurrentZoom}
            />
            {latitude === undefined ? (
              <div className="text-muted-foreground p-4 text-sm">
                Kliknite na mapu da označite tačnu lokaciju akcije
              </div>
            ) : (
              <div className="text-primary p-4 text-sm">
                ✓ Lokacija postavljena ({latitude.toFixed(4)}, {longitude?.toFixed(4)})
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            onClick={() => onBack(form.getValues())}
            variant="outline"
            className="w-1/2 md:w-fit"
            tabIndex={-1}
          >
            <ArrowLeft />
            Nazad
          </Button>

          <Button
            type="submit"
            disabled={!form.formState.isValid}
            className="ml-2 w-1/2 md:ml-0 md:w-fit"
          >
            Dalje
            <ArrowRight />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Step2;
