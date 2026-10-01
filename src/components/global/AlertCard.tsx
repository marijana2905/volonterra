import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  TriangleAlertIcon,
  InfoIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  Terminal,
} from 'lucide-react';

type Props = {
  variant?: 'default' | 'destructive' | 'warning';
  title?: string;
  description?: string;
};

const AlertCard = ({ variant = 'default', title, description }: Props) => {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <AlertCircleIcon className="h-4 w-4" />;
      case 'warning':
        return <TriangleAlertIcon className="h-4 w-4" />;
      default:
        return <InfoIcon className="h-4 w-4" />;
    }
  };

  return (
    <Alert variant={variant}>
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default AlertCard;
