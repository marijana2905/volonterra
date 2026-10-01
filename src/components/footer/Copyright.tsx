'use client';

import { useEffect, useState } from 'react';

const Copyright = () => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (!year) {
    return <span>VolonTerra &copy;</span>;
  }

  return <span>VolonTerra &copy; {year}</span>;
};

export default Copyright;
