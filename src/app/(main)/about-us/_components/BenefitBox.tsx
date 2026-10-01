'use client';

import * as motion from 'motion/react-client';
import { JSX } from 'react';

type BenefitBoxProps = {
  icon: JSX.Element;
  label: string;
  col: string;
  row: string;
  index: number;
  className?: string; // fleksibilna kontrola dimenzija
};

const BenefitBox = ({ icon, label, col, row, className = '' }: BenefitBoxProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`bg-muted/40 hover:bg-muted/60 flex flex-col items-center justify-center rounded-2xl p-6 text-center shadow-md backdrop-blur-md transition-all hover:scale-105 ${className}`}
      style={{
        gridColumnStart: col ? col.split(' ')[0] : undefined,
        gridColumnEnd: col?.includes('span') ? `span ${col.split(' ')[2]}` : undefined,
        gridRowStart: row || undefined,
        width: className.includes('w-') ? undefined : '100%', // malo veće od default
        height: className.includes('h-') ? undefined : '10rem', // malo veće od default
      }}
    >
      {icon}
      <p className="text-foreground mt-3 text-sm font-medium md:text-base">{label}</p>
    </motion.div>
  );
};

export default BenefitBox;
