import type { TextareaHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function FormTextarea({
  name,
  label,
  error,
  className,
  containerClassName,
  ...props
}: FormTextareaProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = error || (errors[name]?.message as string);

  return (
    <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
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
      <textarea
        id={name}
        {...register(name)}
        {...props}
        className={cn(className)}
        style={{
          width: "100%",
          padding: "11px 16px",
          borderRadius: "12px",
          border: `1.5px solid ${fieldError ? "#E55F68" : "#e0e0e0"}`,
          fontSize: "14px",
          color: "#333",
          background: "#fafafa",
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "'DM Sans', sans-serif",
          resize: "none",
          transition: "border-color 0.2s",
          minHeight: "160px",
        }}
        onFocus={(e) =>
          (e.target.style.borderColor = fieldError ? "#E55F68" : "#c0bfff")
        }
        onBlur={(e) =>
          (e.target.style.borderColor = fieldError ? "#E55F68" : "#e0e0e0")
        }
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
