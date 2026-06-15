import { useState, type InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

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
  type,
  ...props
}: FormInputProps) {
  const {
    register,
    formState: { errors },
    getFieldState,
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  // Use getFieldState to get error information, which is more reliable
  const fieldState = getFieldState(name);
  const fieldError = error || (fieldState.error?.message as string);

  console.log(`FormInput [${name}] - Raw Errors:`, errors);
  console.log(`FormInput [${name}] - Field State:`, fieldState);
  console.log(`FormInput [${name}] - Calculated FieldError:`, fieldError);

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
      <div style={{ position: "relative" }}>
        <input
          id={name}
          type={inputType}
          {...register(name)}
          {...props}
          className={cn(className)}
          style={{
            width: "100%",
            padding: "13px 16px",
            paddingRight: isPassword ? "45px" : "16px",
            borderRadius: "50px",
            border: `1.5px solid ${fieldError ? "#E55F68" : "#e0e0e0"}`,
            fontSize: "14px",
            color: "#333",
            background: "#fafafa",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "'DM Sans', sans-serif",
            transition: "border-color 0.2s",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {fieldError && (
        <p
          style={{
            fontSize: "12px",
            color: "#E55F68",
            paddingLeft: "4px",
            margin: 0,
            display: "block",
            visibility: "visible",
          }}
        >
          {fieldError}
        </p>
      )}
    </div>
  );
}
