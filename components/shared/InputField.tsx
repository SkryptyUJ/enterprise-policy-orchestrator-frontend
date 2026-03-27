import { type HTMLInputTypeAttribute } from "react"
import { type Path, useFormContext } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

type InputFieldProps<T extends Record<string, unknown>> = {
  name: Path<T>
  label?: string
  placeholder?: string
  type?: HTMLInputTypeAttribute
  description?: string
  disabled?: boolean
  icon?: LucideIcon
  step?: string
}

const InputField = <T extends Record<string, unknown>>({
  name,
  label,
  placeholder,
  description,
  disabled,
  type = "text",
  icon: Icon,
  step,
}: InputFieldProps<T>) => {
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
            <div className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              )}
              <Input
                {...field}
                id={name}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                step={step}
                className={cn(
                  "h-11 border-border/50 focus-visible:ring-primary",
                  Icon && "pl-10"
                )}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default InputField
