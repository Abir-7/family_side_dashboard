import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormPillGroupProps {
  name: string;
  label?: string;
  options: string[];
  multiple?: boolean;
  error?: string;
  containerClassName?: string;
}

export function FormPillGroup({
  name,
  label,
  options,
  multiple = true,
  error,
  containerClassName,
  disabledText = "Select a category first",
}: FormPillGroupProps & { disabledText?: string }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = error || (errors[name]?.message as string);

  return (
    <div className={cn("w-full flex flex-col gap-2", containerClassName)}>
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
        render={({ field: { value, onChange } }) => {
          if (options.length === 0) {
              return <p className="text-sm text-gray-400">{disabledText}</p>;
          }

          const currentValues = value ?? [];

          const toggle = (opt: string) => {
            if (!multiple) {
              onChange([opt]);
              return;
            }
            if (opt === "All") {
              onChange(["All"]);
              return;
            }
            const without = currentValues.filter((v: string) => v !== "All");
            const next = without.includes(opt)
              ? without.filter((v: string) => v !== opt)
              : [...without, opt];
            onChange(next.length === 0 ? ["All"] : next);
          };

          return (
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => {
                const active = currentValues.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggle(opt)}
                    className={cn(
                      "px-3 py-1 rounded-full font-medium border transition-colors",
                      active
                        ? "bg-brand-400 text-white border-brand-400"
                        : "bg-white text-gray-500 border-gray-200 hover:border-brand-300 hover:text-brand-400",
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          );
        }}
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
