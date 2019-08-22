import { h } from 'preact';
import { useState } from 'preact/hooks';

import { Button } from '@components';
import { uniqueIdRandom } from '@utilities';

import ExpenseItem, { ExpenseItemType } from './ExpenseItem';

export interface ExpensesProps {
	classes?: string;
}

export interface ExpensesState {
	[id: string]: ExpenseItemType;
}

const expenseFactory = (): ExpenseItemType => ({
	id: uniqueIdRandom(),
	name: '',
	amount: 0
});

const Expenses = ({ classes }: ExpensesProps) => {
	const [expenses, setExpenses] = useState<ExpensesState>(() => {
		const first = expenseFactory();
		return { [first.id]: first };
	});

	const handleAddExpense = () => {
		const next = expenseFactory();
		setExpenses({ ...expenses, [next.id]: next });
		console.log(expenses);
	};

	const handleItemChange = (item: ExpenseItemType) => {
		const clone = { ...expenses };
		clone[item.id] = item;
		setExpenses(clone);
	};

	const handleRemoveItem = (item: ExpenseItemType) => {
		const clone = { ...expenses };
		delete clone[item.id];
		setExpenses(clone);
	};

	return (
		<div class={classes}>
			{Object.values(expenses).map(item => (
				<ExpenseItem
					key={item.id}
					item={item}
					onChange={handleItemChange}
					deleteItem={handleRemoveItem}
				/>
			))}
			<Button color="teal" onClick={handleAddExpense}>
				Add
			</Button>
		</div>
	);
};

export default Expenses;
