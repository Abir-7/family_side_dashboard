import { useFormContext } from "react-hook-form";
import { MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormLocationSearchProps {
  name: string;
  placeholder?: string;
  error?: string;
  containerClassName?: string;
}

export function FormLocationSearch({
  name,
  placeholder = "Enter your location",
  error,
  containerClassName,
}: FormLocationSearchProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = error || (errors[name]?.message as string);

  return (
    <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
        style={{
          background: "#fff0f0",
          border: `1.5px solid ${fieldError ? "#e05a6a" : "#fdd0d0"}`,
        }}
      >
        <Search className="w-4 h-4 shrink-0" style={{ color: "#f9a8b4" }} />
        <input
          {...register(name)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "#555", fontFamily: "'DM Sans', sans-serif" }}
        />
        <div className="h-8 w-8 bg-rose-400 rounded-lg flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-white" />
        </div>
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
