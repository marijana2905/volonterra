'use client';

import { useId, useState } from 'react';

import { OrganizerField } from '@/actions/organizer/updateOrganizerField.action';

import TooltipBasic from '@/components/global/TooltipBasic';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit3Icon, Loader2Icon, MapPinIcon, SaveIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  initialValue?: string;
  onSave?: (fieldName: OrganizerField, newAdress: string) => Promise<{ error: string | null }>;
};

const AdressInput = ({ initialValue, onSave }: Props) => {
  const id = useId();
  const [isEditable, setIsEditable] = useState(false);
  const [value, setValue] = useState(initialValue || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!isEditable) {
      setIsEditable(true);
      return;
    }

    // Ako je prosledjena metoda onSave pozovi je inace samo ugasi edit mode adrese
    if (onSave) {
      setIsLoading(true);
      try {
        const { error } = await onSave('address', value);
        if (error) {
          toast.error(error);
        } else {
          toast.success('Adresa je uspešno ažurirana');
          setIsEditable(false);
        }
      } catch (error) {
        toast.error('Greška prilikom čuvanja adrese');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditable(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue || '');
    setIsEditable(false);
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <Label htmlFor={`number-${id}`}>Adresa</Label>
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex items-center gap-2">
          <Input
            disabled={!isEditable || isLoading}
            id={`number-${id}`}
            className="peer ps-10"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <MapPinIcon size={18} />
          </div>

          {isEditable && (
            <Button size={'icon'} variant={'outline'} onClick={handleCancel} disabled={isLoading}>
              <XIcon />
            </Button>
          )}

          <TooltipBasic
            element={
              <Button
                size={`${!isEditable ? 'icon' : 'default'}`}
                variant={`${!isEditable ? 'ghost' : 'default'}`}
                onClick={handleClick}
                disabled={isLoading || (isEditable && value === initialValue)}
              >
                {isEditable ? (
                  <>
                    {isLoading ? <Loader2Icon className="animate-spin" /> : <SaveIcon />}
                    <span className="hidden sm:block">{isLoading ? 'Čuvanje...' : 'Sačuvaj'}</span>
                  </>
                ) : (
                  <Edit3Icon />
                )}
              </Button>
            }
            content={isEditable ? 'Sačuvaj adresu' : 'Izmeni adresu'}
            position="top"
          />
        </div>
      </div>
    </div>
  );
};

export default AdressInput;
