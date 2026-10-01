import { useId } from 'react';
import { UserIcon, UsersIcon } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '@/components/ui/form';

export default function UserTypeRadioButtons() {
  const form = useFormContext();

  const id = useId();

  const items = [
    { value: 'volunteer', label: 'Volonter', Icon: UserIcon },
    { value: 'organization', label: 'Organizacija', Icon: UsersIcon },
  ];

  return (
    <FormField
      control={form.control}
      name="userType"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              className="mb-2 grid-cols-2"
              value={field.value}
              onValueChange={field.onChange}
            >
              {items.map(item => (
                <div
                  key={`${id}-${item.value}`}
                  className="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
                >
                  <div className="flex justify-between gap-2">
                    <RadioGroupItem
                      id={`${id}-${item.value}`}
                      value={item.value}
                      className="order-1 after:absolute after:inset-0"
                    />
                    <item.Icon className="opacity-60" size={16} aria-hidden="true" />
                  </div>
                  <Label htmlFor={`${id}-${item.value}`}>{item.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
