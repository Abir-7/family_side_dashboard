import type { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function FormInput({
  name,
  label,
  error,
  className,
  containerClassName,
  ...props
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = error || (errors[name]?.message as string);

  return (
    <div
      className={cn("w-full", containerClassName)}
      style={{ display: "flex", flexDirection: "column", gap: "6px" }}
    >
      {label && (
        <label
          htmlFor={name}
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
      <input
        id={name}
        {...register(name)}
        {...props}
        className={cn(className)}
        style={{
          width: "100%",
          padding: "11px 16px",
          borderRadius: "50px",
          border: `1.5px solid ${fieldError ? "#e05a6a" : "#e0e0e0"}`,
          fontSize: "14px",
          color: "#333",
          background: "#fafafa",
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "'DM Sans', sans-serif",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) =>
          (e.target.style.borderColor = fieldError ? "#e05a6a" : "#c0bfff")
        }
        onBlur={(e) =>
          (e.target.style.borderColor = fieldError ? "#e05a6a" : "#e0e0e0")
        }
      />
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
