import { useRef, useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
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
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = error || (errors[name]?.message as string);
  const inputRef = useRef<HTMLInputElement>(null);

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

      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => {
          const files: File[] = value ?? [];

          const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
            const selected = Array.from(e.target.files ?? []);
            if (selected.length > 0) {
              onChange([selected[0]]);
            }
          };

          const remove = (index: number) => {
            onChange(files.filter((_, i) => i !== index));
          };

          return (
            <div
              onClick={() => inputRef.current?.click()}
              className={cn(
                "relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors overflow-hidden h-40",
                "hover:border-brand-300 hover:bg-brand-50/30",
                fieldError ? "border-brand-400 bg-brand-50/20" : "border-gray-200",
              )}
            >
              {files.length === 0 ? (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                  <p className="text-sm font-medium text-gray-500">
                    Click to upload photo
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, up to 10MB</p>
                </>
              ) : (
                <ImagePreview file={files[0]} onRemove={() => remove(0)} />
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFiles}
              />
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

function ImagePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="absolute inset-0 group">
      <img
        src={preview}
        className="h-full w-full object-cover"
        alt={file.name}
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="bg-white/90 text-brand-500 rounded-full p-1.5 hover:bg-white transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
