'use client';

import { useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { MoonStar, Sun, SunIcon } from 'lucide-react';

export const ThemeSwitch = () => {
  const id = useId();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative inline-grid h-7 grid-cols-[1fr_1fr] items-center text-xs font-medium">
        <Switch
          id={id}
          checked={false}
          className="peer data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
        />
        <span className="peer-data-[state=checked]:text-muted-foreground/70 pointer-events-none relative ms-0.5 flex min-w-6 items-center justify-center text-center">
          <SunIcon size={12} />
        </span>
        <span className="peer-data-[state=unchecked]:text-muted-foreground/70 pointer-events-none relative me-0.5 flex min-w-6 items-center justify-center text-center">
          <MoonStar size={12} />
        </span>
      </div>
    );
  }

  const checked = theme === 'dark';

  const handleCheckedChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="relative inline-grid h-7 grid-cols-[1fr_1fr] items-center text-xs font-medium">
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        className="peer data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
      />
      <span className="peer-data-[state=checked]:text-muted-foreground/70 pointer-events-none relative ms-0.5 flex min-w-6 items-center justify-center text-center">
        <SunIcon size={12} />
      </span>
      <span className="peer-data-[state=unchecked]:text-muted-foreground/70 pointer-events-none relative me-0.5 flex min-w-6 items-center justify-center text-center">
        <MoonStar size={12} />
      </span>
    </div>
  );
};

export const ThemeToggleDropdownMenuItem = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenuItem onClick={toggleTheme}>
      {theme === 'light' ? <MoonStar fill="currentColor" /> : <Sun />}
      Promena teme
    </DropdownMenuItem>
  );
};

export const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // skeleton for initial render
  if (!mounted) {
    return (
      <Button variant={'outline'} onClick={toggleTheme}>
        <Sun />
      </Button>
    );
  }

  return (
    <Button variant={'outline'} onClick={toggleTheme}>
      {theme === 'light' ? <MoonStar fill="currentColor" className="opacity-80" /> : <Sun />}
      <span className="sr-only">Promena teme</span>
    </Button>
  );
};
