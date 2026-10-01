'use client';

import Image from 'next/image';
import Link from 'next/link';

type Props = {
  width: number;
  height: number;
  type?: 'icon' | 'icon-text';
};

const Logo = ({ width, height, type = 'icon-text' }: Props) => {
  return (
    <Link href="/" passHref>
      <Image
        src={type === 'icon' ? '/logo_without_text.png' : '/logo_navbar_light.png'}
        alt="VolonTerra"
        width={width}
        height={height}
        className="cursor-pointer"
        priority
      />
    </Link>
  );
};

export default Logo;
