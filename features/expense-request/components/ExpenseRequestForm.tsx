"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Receipt, CalendarDays, DollarSign, Tag, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { useCreateExpenseRequest } from "../hooks/useCreateExpenseRequest"

const CATEGORIES = [
    "Podróż służbowa",
    "Sprzęt biurowy",
    "Szkolenia",
    "Oprogramowanie",
    "Reprezentacja",
    "Transport",
    "Inne",
]

function getTodayString() {
    return new Date().toISOString().slice(0, 10)
}

export function ExpenseRequestForm() {
    const router = useRouter()
    const { mutate, isPending } = useCreateExpenseRequest()

    const [form, setForm] = useState({
        amount: "",
        category: "",
        description: "",
        expenseDate: getTodayString(),
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleCategoryChange(value: string) {
        setForm((prev) => ({ ...prev, category: value }))
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const amount = parseFloat(form.amount)
        if (isNaN(amount) || amount <= 0) {
            toast.error("Kwota musi być liczbą większą od 0")
            return
        }

        mutate(
            {
                amount,
                category: form.category,
                description: form.description,
                expenseDate: form.expenseDate,
            },
            {
                onSuccess: () => {
                    toast.success("Wniosek został złożony pomyślnie")
                    router.push("/dashboard")
                },
                onError: () => {
                    toast.error("Nie udało się złożyć wniosku. Spróbuj ponownie.")
                },
            }
        )
    }

    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Receipt className="size-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Nowy wniosek wydatkowy</CardTitle>
                        <CardDescription>
                            Wypełnij formularz, aby złożyć wniosek o zwrot kosztów.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form id="expense-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="amount" className="flex items-center gap-1.5">
                                <DollarSign className="size-3.5 text-muted-foreground" />
                                Kwota (PLN)
                            </Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                value={form.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="expenseDate" className="flex items-center gap-1.5">
                                <CalendarDays className="size-3.5 text-muted-foreground" />
                                Data wydatku
                            </Label>
                            <Input
                                id="expenseDate"
                                name="expenseDate"
                                type="date"
                                value={form.expenseDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="category" className="flex items-center gap-1.5">
                            <Tag className="size-3.5 text-muted-foreground" />
                            Kategoria
                        </Label>
                        <Select
                            value={form.category}
                            onValueChange={handleCategoryChange}
                            required
                        >
                            <SelectTrigger id="category" className="w-full">
                                <SelectValue placeholder="Wybierz kategorię" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description" className="flex items-center gap-1.5">
                            <FileText className="size-3.5 text-muted-foreground" />
                            Opis
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Opisz szczegóły wydatku..."
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            required
                            className="resize-none"
                        />
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t px-4 py-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isPending}
                >
                    Anuluj
                </Button>
                <Button type="submit" form="expense-form" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Wysyłanie...
                        </>
                    ) : (
                        "Złóż wniosek"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
