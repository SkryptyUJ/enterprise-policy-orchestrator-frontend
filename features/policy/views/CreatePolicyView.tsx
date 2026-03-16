"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreatePolicy } from "@/features/policy/hooks/usePolicies"

export function CreatePolicyView() {
  const router = useRouter()
  const { mutate: createPolicy, isPending } = useCreatePolicy()

  const [form, setForm] = useState({ title: "", description: "" })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createPolicy(form, {
      onSuccess: () => router.push("/dashboard"),
    })
  }

  return (
    <div className="p-6 max-w-lg flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Nowa polityka</h1>
        <p className="text-sm text-muted-foreground">Wypełnij poniższy formularz, aby utworzyć politykę.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            Nazwa
          </label>
          <Input
            id="title"
            name="title"
            placeholder="Nazwa polityki"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium">
            Opis
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Opis polityki"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 resize-none"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Anuluj
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Zapisywanie..." : "Utwórz politykę"}
          </Button>
        </div>
      </form>
    </div>
  )
}
