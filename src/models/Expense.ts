export interface ExpenseItem {
	id: string;
	name: string;
	amount: number;
}

export interface ExpensesForDay {
	[name: string]: number;
}
