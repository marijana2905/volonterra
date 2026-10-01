'use client';

import { useEffect, useState } from 'react';
import { useActionForm } from '@/hooks/useActionForm';
import { blobToBase64, cn } from '@/lib/utils';

import { actionSchema, Step4Values } from '@/schemas/actionSchema';
import { z } from 'zod';

import { createAction } from '@/actions/action/createAction.action';

import YesNoAlertDialog from '@/components/global/YesNoAlertDialog';

import ActionFormStepper from './ActionFormStepper';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SaveIcon, XIcon } from 'lucide-react';
import { BarLoader } from 'react-spinners';
import { editAction } from '@/actions/action/editAction.action';

type Props = {
  initialData?: Partial<z.infer<typeof actionSchema>>;
  isEdit?: boolean;
  id?: string;
};

const ActionFormWizard = ({ initialData, isEdit = false, id }: Props) => {
  const { data, step, next, back, update, reset } = useActionForm(isEdit, initialData);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Ovo odrzava trenutno stanje kamere i zoom-a na mapi prilikom setanja kroz korake
  const [currentCenter, setCurrentCenter] = useState<[number, number]>([
    data.latitude ?? 44.0165,
    data.longitude ?? 21.0059,
  ]);
  const [currentZoom, setCurrentZoom] = useState(7);

  // Smooth scroll pri prelazu izmedju koraka
  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [step]);

  const handleSubmitAll = async (finalStepData?: Step4Values) => {
    setIsLoading(true);

    // Kombinuj postojece podatke sa podacima iz poslednjeg step-a
    const completeData = finalStepData ? { ...data, ...finalStepData } : data;

    if (!isEdit) {
      const base64Image = completeData.bannerImage
        ? await blobToBase64(completeData.bannerImage)
        : null;

      const { error } = await createAction(completeData, base64Image);

      if (error) {
        toast.error(error);
        setIsLoading(false);
        return;
      }

      toast.success('Akcija uspešno kreirana!');
      reset();
    } else {
      let base64Image = null;
      let isNewImage = completeData.bannerImage?.startsWith('blob:') || false;
      let isDeletedImage = completeData.bannerImage === null;

      if (isNewImage && !isDeletedImage) {
        base64Image = await blobToBase64(completeData.bannerImage!);
      }

      const { error } = await editAction(
        id ?? '',
        completeData,
        base64Image,
        isNewImage,
        isDeletedImage
      );

      if (error) {
        toast.error(error);
        setIsLoading(false);
        return;
      }

      toast.success('Akcija uspešno izmenjena!');
      reset();
    }

    setIsLoading(false);
  };

  return (
    <>
      <div
        className={cn(
          'relative mb-4 flex w-full flex-col gap-8 overflow-hidden py-4 md:mb-8 md:gap-12 md:rounded-xl md:border md:p-8 md:shadow',
          isLoading && 'pointer-events-none opacity-50'
        )}
      >
        <ActionFormStepper currentStep={step} />

        {/* Step 1 */}
        {step === 1 && (
          <Step1
            defaultValues={{
              title: data.title ?? '',
              description: data.description ?? '',
              categories: data.categories ?? [],
            }}
            onSubmit={vals => {
              update(vals);
              next();
            }}
          />
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Step2
            defaultValues={{
              latitude: data.latitude,
              longitude: data.longitude,
              city: data.city ?? '',
              address: data.address ?? '',
            }}
            onSubmit={vals => {
              update(vals);
              next();
            }}
            onBack={vals => {
              update(vals);
              back();
            }}
            currentCenter={currentCenter}
            setCurrentCenter={setCurrentCenter}
            currentZoom={currentZoom}
            setCurrentZoom={setCurrentZoom}
          />
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Step3
            defaultValues={{
              dateRange: data.dateRange ?? {
                from: new Date(Date.now() + 24 * 60 * 60 * 1000),
                to: new Date(Date.now() + 24 * 60 * 60 * 1000),
              },
              startTime: data.startTime ?? '',
              endTime: data.endTime ?? '',
            }}
            onSubmit={vals => {
              update(vals);
              next();
            }}
            onBack={vals => {
              update(vals);
              back();
            }}
          />
        )}

        {/* Step 4 */}
        {step === 4 && (
          <Step4
            defaultValues={{
              bannerImage: data.bannerImage ?? null,
              minParticipants: data.minParticipants ?? 1,
              maxParticipants: data.maxParticipants ?? 20,
            }}
            onSubmit={vals => {
              update(vals);
              handleSubmitAll(vals);
            }}
            onBack={vals => {
              update(vals);
              back();
            }}
            isEdit={isEdit}
            isLoading={isLoading}
          />
        )}

        <div className="fixed top-16 right-0 w-full rounded-t-md md:rounded-t-xl">
          <BarLoader width="100%" color="green" loading={isLoading} />
        </div>
      </div>

      {/* Cancel Button */}
      {!isEdit && (
        <div className="mb-4 flex items-center justify-center">
          <Button
            tabIndex={-1}
            variant={'destructive'}
            size={'sm'}
            onClick={() => setIsCancelOpen(true)}
            disabled={isLoading}
          >
            <XIcon />
            Odustani
          </Button>
        </div>
      )}

      {/* Confirmation Dialog for canceling */}
      <YesNoAlertDialog
        title="Da li sigurno želite da odustanete?"
        description="Svi uneseni podaci će biti izgubljeni."
        isOpen={isCancelOpen}
        setIsOpen={setIsCancelOpen}
        onConfirm={reset}
        confirmText="Da, odustani"
        cancelText="Ne, nastavi"
      />
    </>
  );
};

export default ActionFormWizard;
