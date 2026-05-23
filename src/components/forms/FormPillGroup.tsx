import { useFormContext } from "react-hook-form";
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
}: FormPillGroupProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const fieldError = error || (errors[name]?.message as string);
  const value: string[] = watch(name) ?? [];

  const toggle = (opt: string) => {
    if (!multiple) {
      setValue(name, [opt], { shouldValidate: true });
      return;
    }
    if (opt === "All") {
      setValue(name, ["All"], { shouldValidate: true });
      return;
    }
    const without = value.filter((v) => v !== "All");
    const next = without.includes(opt)
      ? without.filter((v) => v !== opt)
      : [...without, opt];
    setValue(name, next.length === 0 ? ["All"] : next, {
      shouldValidate: true,
    });
  };

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
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={cn(
                "px-3 py-1 rounded-full font-medium border transition-colors",
                active
                  ? "bg-rose-400 text-white border-rose-400"
                  : "bg-white text-gray-500 border-gray-200 hover:border-rose-300 hover:text-rose-400",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
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
