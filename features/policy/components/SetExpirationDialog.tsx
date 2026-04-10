"use client"

import { useState } from "react"
import { CalendarOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useSetPolicyExpiration } from "../hooks/usePolicies"

interface SetExpirationDialogProps {
    policyId: number
    policyName: string
    currentExpiresAt: string | null
}

export function SetExpirationDialog({ policyId, policyName, currentExpiresAt }: SetExpirationDialogProps) {
    const [open, setOpen] = useState(false)
    const [expiresAt, setExpiresAt] = useState(
        currentExpiresAt ? new Date(currentExpiresAt).toISOString().slice(0, 16) : ""
    )

    const { mutate, isPending } = useSetPolicyExpiration(policyId)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!expiresAt) return

        mutate(
            { expiresAt: new Date(expiresAt).toISOString() },
            {
                onSuccess: () => {
                    toast.success("Data zakończenia została ustawiona")
                    setOpen(false)
                },
                onError: (error) => {
                    toast.error(error instanceof Error ? error.message : "Nie udało się ustawić daty zakończenia")
                },
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <CalendarOff className="size-4" />
                    {currentExpiresAt ? "Zmień datę zakończenia" : "Ustaw datę zakończenia"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ustaw datę zakończenia obowiązywania</DialogTitle>
                    <DialogDescription>
                        Polityka <span className="font-medium text-foreground">{policyName}</span> zostanie automatycznie dezaktywowana po upływie ustawionej daty.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="py-4">
                        <Label htmlFor="expiresAt">Data i czas zakończenia</Label>
                        <Input
                            id="expiresAt"
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="mt-2"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                            Anuluj
                        </Button>
                        <Button type="submit" disabled={isPending || !expiresAt}>
                            {isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Zapisywanie...
                                </>
                            ) : (
                                "Zapisz"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
