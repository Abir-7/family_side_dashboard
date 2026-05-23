import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useFormContext, Controller } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface FormDatePickerProps {
  name: string
  label?: string
  placeholder?: string
}

export function FormDatePicker({ name, label, placeholder = "Pick a date" }: FormDatePickerProps) {
  const { control } = useFormContext()

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[13px] font-medium text-[#333] font-['DM_Sans',sans-serif]">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-11 rounded-full bg-[#fafafa] border-[#e0e0e0] hover:bg-slate-50",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(new Date(field.value), "PPP") : <span>{placeholder}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date?.toISOString())}
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  )
}
