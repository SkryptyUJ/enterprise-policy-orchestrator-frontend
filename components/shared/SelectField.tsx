import { type Path, useFormContext } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type SelectOption = {
  label: string
  value: string
}

type SelectFieldProps<T extends Record<string, unknown>> = {
  name: Path<T>
  options: SelectOption[]
  label?: string
  placeholder?: string
  description?: string
  disabled?: boolean
}

const SelectField = <T extends Record<string, unknown>>({
  name,
  options,
  label,
  placeholder = "Wybierz...",
  description,
  disabled,
}: SelectFieldProps<T>) => {
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
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger id={name} className="h-11 border-border/50 focus:ring-primary">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default SelectField
