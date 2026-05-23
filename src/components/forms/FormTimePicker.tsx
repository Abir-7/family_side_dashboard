import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface FormTimePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  containerClassName?: string;
}

export function FormTimePicker({
  name,
  label,
  placeholder,
  containerClassName,
}: FormTimePickerProps) {
  const { control } = useFormContext();

  return (
    <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label className="text-[13px] font-medium text-[#333] font-['DM_Sans',sans-serif]">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="time"
            placeholder={placeholder}
            className={cn(
              "rounded-full w-full px-4 text-sm bg-[#fafafa] border-[#e0e0e0] focus:ring-0 transition-colors h-11",
              field.value ? "text-gray-900" : "text-gray-500"
            )}
          />
        )}
      />
    </div>
  );
}
