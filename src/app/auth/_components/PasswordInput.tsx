import { useId, useMemo, useState } from 'react';
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';

export default function PasswordInput() {
  const form = useFormContext();

  const id = useId();
  const [password, setPassword] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible(prevState => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{6,}/, text: 'Najmanje 6 karaktera' },
      { regex: /[0-9]/, text: 'Najmanje 1 broj' },
      { regex: /[a-z]/, text: 'Najmanje 1 malo slovo' },
      { regex: /[A-Z]/, text: 'Najmanje 1 veliko slovo' },
    ];

    return requirements.map(req => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter(req => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-border';
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score === 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Unesite lozinku';
    if (score <= 2) return 'Slaba lozinka';
    if (score === 3) return 'Srednja lozinka';
    return 'Jaka lozinka';
  };

  return (
    <div>
      <div className="*:not-first:mt-2">
        <div className="relative">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Lozinka</FormLabel>
                <FormControl>
                  <Input
                    id={id}
                    placeholder="••••••••"
                    type={isVisible ? 'text' : 'password'}
                    {...field}
                    aria-describedby={`${id}-description`}
                    value={form.watch('password')}
                    onChange={e => {
                      field.onChange(e);
                      setPassword(e.target.value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 top-3 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOffIcon size={16} aria-hidden="true" />
            ) : (
              <EyeIcon size={16} aria-hidden="true" />
            )}
          </button>
        </div>

        {password && (
          <>
            <div
              className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
              role="progressbar"
              aria-valuenow={strengthScore}
              aria-valuemin={0}
              aria-valuemax={4}
              aria-label="Password strength"
            >
              <div
                className={`h-full ${getStrengthColor(
                  strengthScore
                )} transition-all duration-500 ease-out`}
                style={{ width: `${(strengthScore / 4) * 100}%` }}
              ></div>
            </div>

            <p id={`${id}-description`} className="text-foreground mb-2 text-sm font-medium">
              {getStrengthText(strengthScore)}. Mora ispuniti:
            </p>

            <ul className="space-y-1.5" aria-label="Password requirements">
              {strength.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  {req.met ? (
                    <CheckIcon size={16} className="text-emerald-500" aria-hidden="true" />
                  ) : (
                    <XIcon size={16} className="text-muted-foreground/80" aria-hidden="true" />
                  )}
                  <span
                    className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
                  >
                    {req.text}
                    <span className="sr-only">
                      {req.met ? ' - Requirement met' : ' - Requirement not met'}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
