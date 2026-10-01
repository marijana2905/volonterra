import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useSliderWithInput } from '@/hooks/use-slider-with-input';
import { ZoneFormSchemaType } from '@/schemas/zoneSchema';
import { useFormContext } from 'react-hook-form';

const FormRadiusSlider = () => {
  const form = useFormContext<ZoneFormSchemaType>();
  const radius = form.watch('radius');

  const minValue = 1;
  const maxValue = 100;
  const initialValue = [radius];

  const {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
  } = useSliderWithInput({ minValue, maxValue, initialValue });

  // Syncaj sliderValue sa formom kad se promijeni
  const onSliderChange = (value: number[]) => {
    handleSliderChange(value);
    form.setValue('radius', value[0] ?? minValue);
  };

  const onInputBlur = () => {
    validateAndUpdateValue(inputValues[0] ?? String(minValue), 0);
    form.setValue('radius', Number(inputValues[0] ?? minValue));
  };

  return (
    <div className="flex items-center gap-4">
      <Slider
        className="grow"
        value={sliderValue}
        onValueChange={onSliderChange}
        min={minValue}
        max={maxValue}
      />
      <Input
        className="h-8 w-12 px-2 py-1"
        type="text"
        inputMode="decimal"
        value={inputValues[0]}
        onChange={e => handleInputChange(e, 0)}
        onBlur={onInputBlur}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onInputBlur();
          }
        }}
      />
    </div>
  );
};

export default FormRadiusSlider;
