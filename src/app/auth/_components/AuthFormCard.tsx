import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
};

const AuthFormCard = ({ title, description, children }: Props) => {
  return (
    <Card className="w-full overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-8 p-6 lg:p-12">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground text-balance">{description}</p>
          </div>
          {children}
        </div>
        <div className="bg-muted relative hidden md:block">
          <Image
            src="/auth_image_dark.webp"
            alt="Image"
            width={2000}
            height={2000}
            className="absolute inset-0 hidden h-full w-full object-cover dark:block"
          />
          <Image
            src="/auth_image.webp"
            alt="Image"
            width={2000}
            height={2000}
            className="absolute inset-0 h-full w-full object-cover dark:hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthFormCard;
