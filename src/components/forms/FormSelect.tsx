import { useFormContext } from "react-hook-form";
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
}

export function FormSelect({
  name,
  label,
  placeholder,
  options,
  error,
  containerClassName,
}: FormSelectProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fieldError = error || (errors[name]?.message as string);
  const value = watch(name);

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
      <Select
        value={value}
        onValueChange={(val) => setValue(name, val, { shouldValidate: true })}
      >
        <SelectTrigger
          className={cn(
            "rounded-xl h-10 text-sm border-gray-200 focus:ring-rose-200 text-gray-400",
            fieldError && "border-rose-400",
          )}
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
      {fieldError && (
        <p
          style={{
            fontSize: "12px",
            color: "#e05a6a",
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
