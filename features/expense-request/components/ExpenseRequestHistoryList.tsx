"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { getExpenseRequestErrorMessage, type ExpenseRequest } from "../api"
import { useExpenseRequestDetails, useExpenseRequests } from "../hooks/useExpenseRequests"
import { ExpenseRequestDetailsSheet } from "./ExpenseRequestDetailsSheet"

type SortField = "expenseDate" | "submittedAt" | "amount" | "category"
type SortOrder = "asc" | "desc"

type SortOption = {
	value: string
	label: string
	sortBy: SortField
	sortOrder: SortOrder
}

const SORT_OPTIONS: SortOption[] = [
	{ value: "submittedAt-desc", label: "Najnowsze", sortBy: "submittedAt", sortOrder: "desc" },
	{ value: "submittedAt-asc", label: "Najstarsze", sortBy: "submittedAt", sortOrder: "asc" },
	{ value: "expenseDate-desc", label: "Data wydatku malejąco", sortBy: "expenseDate", sortOrder: "desc" },
	{ value: "expenseDate-asc", label: "Data wydatku rosnąco", sortBy: "expenseDate", sortOrder: "asc" },
	{ value: "amount-desc", label: "Kwota malejąco", sortBy: "amount", sortOrder: "desc" },
	{ value: "amount-asc", label: "Kwota rosnąco", sortBy: "amount", sortOrder: "asc" },
	{ value: "category-asc", label: "Kategoria A-Z", sortBy: "category", sortOrder: "asc" },
	{ value: "category-desc", label: "Kategoria Z-A", sortBy: "category", sortOrder: "desc" },
]

const STATUS_LABELS: Record<ExpenseRequest["status"], string> = {
	WAITING_FOR_APPROVAL: "Oczekuje na akceptację",
	ESCALATED: "Eskalowany",
	APPROVED: "Zatwierdzony",
	DECLINED: "Odrzucony",
}

const STATUS_VARIANTS: Record<ExpenseRequest["status"], "secondary" | "destructive" | "outline"> = {
	WAITING_FOR_APPROVAL: "outline",
	ESCALATED: "secondary",
	APPROVED: "secondary",
	DECLINED: "destructive",
}

function formatCurrency(value: number) {
	return new Intl.NumberFormat("pl-PL", {
		style: "currency",
		currency: "PLN",
	}).format(value)
}

function formatDate(value: string) {
	return new Date(value).toLocaleDateString("pl-PL")
}

export function sortRequests(requests: ExpenseRequest[], sortBy: SortField, sortOrder: SortOrder) {
	return [...requests].sort((left, right) => {
		let comparison = 0

		if (sortBy === "amount") {
			comparison = left.amount - right.amount
		} else if (sortBy === "expenseDate" || sortBy === "submittedAt") {
			comparison = new Date(left[sortBy]).getTime() - new Date(right[sortBy]).getTime()
		} else {
			comparison = left.category.localeCompare(right.category, "pl")
		}

		return sortOrder === "asc" ? comparison : -comparison
	})
}

export function ExpenseRequestHistoryList() {
	const [search, setSearch] = useState("")
	const [category, setCategory] = useState("")
	const [fromDate, setFromDate] = useState("")
	const [toDate, setToDate] = useState("")
	const [minAmount, setMinAmount] = useState("")
	const [maxAmount, setMaxAmount] = useState("")
	const [sortValue, setSortValue] = useState("submittedAt-desc")
	const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null)

	const selectedSort = useMemo(
		() => SORT_OPTIONS.find((option) => option.value === sortValue) ?? SORT_OPTIONS[0],
		[sortValue]
	)

	const {
		data: requests,
		isLoading,
		isError,
		error: requestsError,
	} = useExpenseRequests()
	const {
		data: selectedDetails,
		isLoading: isDetailsLoading,
		isError: isDetailsError,
		error: detailsError,
	} = useExpenseRequestDetails(selectedExpenseId)

	const filteredRequests = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase()
		const normalizedCategory = category.trim().toLowerCase()
		const minValue = minAmount ? Number(minAmount) : undefined
		const maxValue = maxAmount ? Number(maxAmount) : undefined

		const filtered = (requests ?? []).filter((request) => {
			const matchesSearch =
				!normalizedSearch ||
				request.description.toLowerCase().includes(normalizedSearch) ||
				request.category.toLowerCase().includes(normalizedSearch)
			const matchesCategory = !normalizedCategory || request.category.toLowerCase().includes(normalizedCategory)
			const matchesFromDate = !fromDate || request.expenseDate >= fromDate
			const matchesToDate = !toDate || request.expenseDate <= toDate
			const matchesMinAmount = typeof minValue !== "number" || Number.isNaN(minValue) ? true : request.amount >= minValue
			const matchesMaxAmount = typeof maxValue !== "number" || Number.isNaN(maxValue) ? true : request.amount <= maxValue

			return (
				matchesSearch &&
				matchesCategory &&
				matchesFromDate &&
				matchesToDate &&
				matchesMinAmount &&
				matchesMaxAmount
			)
		})

		return sortRequests(filtered, selectedSort.sortBy, selectedSort.sortOrder)
	}, [requests, search, category, fromDate, toDate, minAmount, maxAmount, selectedSort])

	function clearFilters() {
		setSearch("")
		setCategory("")
		setFromDate("")
		setToDate("")
		setMinAmount("")
		setMaxAmount("")
		setSortValue("submittedAt-desc")
	}

	return (
		<>
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between gap-3">
						<div>
							<CardTitle>Historia wniosków wydatkowych</CardTitle>
							<CardDescription>
								Filtruj i sortuj swoje wnioski.
							</CardDescription>
						</div>
						<Button variant="outline" onClick={clearFilters}>
							Wyczyść filtry
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						<div className="space-y-2 xl:col-span-2">
							<Label htmlFor="search">Wyszukaj</Label>
							<div className="relative">
								<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="search"
									value={search}
									onChange={(event) => setSearch(event.target.value)}
									placeholder="Opis lub kategoria"
									className="pl-9"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="category">Kategoria</Label>
							<Input
								id="category"
								value={category}
								onChange={(event) => setCategory(event.target.value)}
								placeholder="Np. Podróż służbowa"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="sort">Sortowanie</Label>
							<Select value={sortValue} onValueChange={setSortValue}>
								<SelectTrigger id="sort">
									<SelectValue placeholder="Wybierz" />
								</SelectTrigger>
								<SelectContent>
									{SORT_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="fromDate">Data od</Label>
							<Input
								id="fromDate"
								type="date"
								value={fromDate}
								onChange={(event) => setFromDate(event.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="toDate">Data do</Label>
							<Input
								id="toDate"
								type="date"
								value={toDate}
								onChange={(event) => setToDate(event.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="minAmount">Kwota od</Label>
							<Input
								id="minAmount"
								type="number"
								min="0"
								step="0.01"
								value={minAmount}
								onChange={(event) => setMinAmount(event.target.value)}
								placeholder="0.00"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="maxAmount">Kwota do</Label>
							<Input
								id="maxAmount"
								type="number"
								min="0"
								step="0.01"
								value={maxAmount}
								onChange={(event) => setMaxAmount(event.target.value)}
								placeholder="0.00"
							/>
						</div>
					</div>

					<div className="rounded-md border">
						<div className="grid grid-cols-[1.3fr_1fr_1fr_0.9fr_0.9fr] gap-4 border-b bg-muted/30 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
							<span>Opis</span>
							<span>Kategoria</span>
							<span>Data wydatku</span>
							<span>Kwota</span>
							<span>Status</span>
						</div>

						{isLoading && (
							<p className="px-4 py-8 text-sm text-muted-foreground">Ładowanie historii...</p>
						)}

						{isError && !isLoading && (
							<p className="px-4 py-8 text-sm text-destructive">
								{getExpenseRequestErrorMessage(requestsError, "Nie udało się pobrać historii wniosków.", {
									403: "Brak uprawnień do podglądu historii wniosków.",
									404: "Nie znaleziono historii wniosków dla wskazanego użytkownika.",
								})}
							</p>
						)}

						{!isLoading && !isError && filteredRequests.length === 0 && (
							<p className="px-4 py-8 text-sm text-muted-foreground">
								Brak wniosków dla wybranych filtrów.
							</p>
						)}

						{!isLoading &&
							!isError &&
							filteredRequests.map((request) => (
								<button
									key={request.id}
									type="button"
									onClick={() => setSelectedExpenseId(request.id)}
									className="grid w-full cursor-pointer grid-cols-[1.3fr_1fr_1fr_0.9fr_0.9fr] gap-4 border-b px-4 py-3 text-left text-sm transition-colors hover:bg-muted/40 last:border-b-0"
								>
									<span className="line-clamp-2">{request.description}</span>
									<span>{request.category}</span>
									<span>{formatDate(request.expenseDate)}</span>
									<span className="font-medium">{formatCurrency(request.amount)}</span>
									<span>
										<Badge variant={STATUS_VARIANTS[request.status]}>
											{STATUS_LABELS[request.status]}
										</Badge>
									</span>
								</button>
							))}
					</div>

					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<ArrowUpDown className="size-3.5" />
					</div>
				</CardContent>
			</Card>

			<ExpenseRequestDetailsSheet
				open={Boolean(selectedExpenseId)}
				onOpenChange={(open) => {
					if (!open) setSelectedExpenseId(null)
				}}
				details={selectedDetails}
				isLoading={isDetailsLoading}
				isError={isDetailsError}
				error={detailsError}
			/>
		</>
	)
}

