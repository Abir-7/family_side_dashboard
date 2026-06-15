import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  error?: string;
  containerClassName?: string;
  disabled?: boolean;
}

export function FormSelect({
  name,
  label,
  placeholder,
  options,
  error,
  containerClassName,
  disabled,
}: FormSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = error || (errors[name]?.message as string);

  return (
    <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#333",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "rounded-full w-full px-4 text-sm bg-[#fafafa] focus:ring-0 focus:ring-offset-0 transition-colors",
                field.value ? "text-gray-900" : "text-gray-500",
                fieldError
                  ? "border-[1.5px] border-[#E55F68] focus:border-[#E55F68]"
                  : "border-[1.5px] border-[#e0e0e0] focus:border-[#c0bfff]",
              )}
              style={{ fontFamily: "'DM Sans', sans-serif", height: "44px" }}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {fieldError && (
        <p
          style={{
            fontSize: "12px",
            color: "#E55F68",
            paddingLeft: "4px",
            margin: 0,
          }}
        >
          {fieldError}
        </p>
      )}
    </div>
  );
}
