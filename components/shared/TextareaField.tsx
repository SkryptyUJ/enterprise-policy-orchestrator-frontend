import { type Path, useFormContext } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type TextareaFieldProps<T extends Record<string, unknown>> = {
  name: Path<T>
  label?: string
  placeholder?: string
  description?: string
  disabled?: boolean
  rows?: number
  className?: string
}

const TextareaField = <T extends Record<string, unknown>>({
  name,
  label,
  placeholder,
  description,
  disabled,
  rows = 4,
  className,
}: TextareaFieldProps<T>) => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {label && (
            <Label htmlFor={name} className="mb-1 font-semibold">
              {label}
            </Label>
          )}
          <FormControl>
            <Textarea
              {...field}
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={cn("border-border/50 focus-visible:ring-primary resize-none", className)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default TextareaField
