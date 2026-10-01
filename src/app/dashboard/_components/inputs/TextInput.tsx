'use client';

import { useId, useState } from 'react';

import TooltipBasic from '@/components/global/TooltipBasic';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CreditCardIcon, Edit3Icon, GlobeIcon, Loader2Icon, SaveIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { FaFacebook, FaInstagram, FaPaypal, FaXTwitter } from 'react-icons/fa6';
import { OrganizerField } from '@/actions/organizer/updateOrganizerField.action';

type Props = {
  type: 'facebookLink' | 'instagramLink' | 'xLink' | 'website' | 'paypalLink' | 'bankAccount';
  initialValue?: string;
  onSave?: (field: OrganizerField, newSocialMediaLink: string) => Promise<{ error: string | null }>;
};

const TextInput = ({ type, initialValue, onSave }: Props) => {
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
        const { error } = await onSave(type, value);
        if (error) {
          toast.error(error);
        } else {
          toast.success('Link je uspešno ažuriran');
          setIsEditable(false);
        }
      } catch (error) {
        toast.error('Greška prilikom čuvanja linka');
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
      <Label htmlFor={`number-${id}`}>
        {type === 'facebookLink' && 'Facebook link'}
        {type === 'instagramLink' && 'Instagram korisničko ime'}
        {type === 'xLink' && 'X(Twitter) korisničko ime'}
        {type === 'website' && 'Adresa web stranice'}
        {type === 'paypalLink' && 'PayPal link'}
        {type === 'bankAccount' && 'Broj bankovnog računa'}
      </Label>
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex items-center gap-2">
          <Input
            disabled={!isEditable || isLoading}
            id={`number-${id}`}
            className="peer ps-10"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-80">
            {type === 'facebookLink' && <FaFacebook size={18} />}
            {type === 'instagramLink' && <FaInstagram size={18} />}
            {type === 'xLink' && <FaXTwitter size={18} />}
            {type === 'website' && <GlobeIcon size={18} />}
            {type === 'paypalLink' && <FaPaypal size={18} />}
            {type === 'bankAccount' && <CreditCardIcon size={18} />}
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
            content={isEditable ? 'Sačuvaj link' : 'Izmeni link'}
            position="top"
          />
        </div>
      </div>
    </div>
  );
};

export default TextInput;
