import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';

const steps = [
  {
    step: 1,
    title: 'Prvi korak',
    description: 'Naslov, opis, kategorije',
  },
  {
    step: 2,
    title: 'Drugi korak',
    description: 'Lokacija',
  },
  {
    step: 3,
    title: 'Treći korak',
    description: 'Datum i vreme početka',
  },
  {
    step: 4,
    title: 'Četvrti korak',
    description: 'Baner i broj učesnika',
  },
];

type Props = {
  currentStep: number;
};

const ActionFormStepper = ({ currentStep }: Props) => {
  return (
    <Stepper className="w-full" value={currentStep}>
      {steps.map(({ step, title, description }) => (
        <StepperItem key={step} step={step} className="relative flex-1 flex-col!">
          <StepperTrigger className="flex-col gap-3 rounded">
            <StepperIndicator />
            <div className="space-y-0.5 px-2 max-sm:hidden">
              <StepperTitle>{title}</StepperTitle>
              <StepperDescription className="max-sm:hidden">{description}</StepperDescription>
            </div>
          </StepperTrigger>
          {step < steps.length && (
            <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
          )}
        </StepperItem>
      ))}
    </Stepper>
  );
};

export default ActionFormStepper;
