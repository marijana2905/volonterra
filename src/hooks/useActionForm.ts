import { useState, useEffect } from 'react';
import { ActionFormValues } from '@/schemas/actionSchema';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'action-form-data';

export function useActionForm(isEdit: boolean, initial?: Partial<ActionFormValues>) {
  const router = useRouter();

  const [data, setData] = useState<Partial<ActionFormValues>>(() => {
    if (initial) return initial;
    if (isEdit) return {};
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Ukloni blob URL-ove jer postaju nevalidni nakon refresh-a
        if (parsedData.bannerImage && parsedData.bannerImage.startsWith('blob:')) {
          parsedData.bannerImage = null;
        }
        return parsedData;
      }
      return {};
    } catch {
      return initial || {};
    }
  });

  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isEdit) return;

    // Kreiraj kopiju podataka za čuvanje u localStorage
    const dataToSave = { ...data };

    // Ne čuvaj blob URL-ove jer postaju nevalidni nakon refresh-a
    if (dataToSave.bannerImage && dataToSave.bannerImage.startsWith('blob:')) {
      const { ...restData } = dataToSave;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restData));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [data, isEdit]);

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const update = (values: Partial<ActionFormValues>) => {
    setData((prev) => ({ ...prev, ...values }));
  };

  const reset = () => {
    if (!isEdit) {
      localStorage.removeItem(STORAGE_KEY);
    }
    setData({});
    // setStep(1);
    router.push('/dashboard/org/actions');
  };

  return { data, step, next, back, update, reset };
}
