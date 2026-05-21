import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormImageUploadProps {
  name: string;
  label?: string;
  optional?: boolean;
  error?: string;
  containerClassName?: string;
}

export function FormImageUpload({
  name,
  label,
  optional,
  error,
  containerClassName,
}: FormImageUploadProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fieldError = error || (errors[name]?.message as string);
  const files: File[] = watch(name) ?? [];
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setValue(name, [...files, ...selected], { shouldValidate: true });
  };

  const remove = (index: number) => {
    setValue(
      name,
      files.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

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
          {label}{" "}
          {optional && (
            <span style={{ color: "#aaa", fontWeight: 400 }}>(Optional)</span>
          )}
        </label>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors",
          "hover:border-rose-300 hover:bg-rose-50/30",
          fieldError ? "border-rose-400 bg-rose-50/20" : "border-gray-200",
          files.length > 0 ? "min-h-20 p-3" : "h-40",
        )}
      >
        {files.length === 0 ? (
          <>
            <ImageIcon className="w-8 h-8 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">
              Click to upload photos
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, up to 10MB</p>
          </>
        ) : (
          <div className="flex flex-wrap gap-2 w-full">
            {files.map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                  alt={file.name}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(i);
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-rose-400 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            <div className="h-16 w-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFiles}
        />
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
