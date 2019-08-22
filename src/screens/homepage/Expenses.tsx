import { h } from 'preact';
import { observer } from 'mobx-preact';

import { Button } from '@components';

import ExpenseItem from './ExpenseItem';
import { useExpenseStore } from '@stores';

export interface ExpensesProps {
	classes?: string;
}

export type ExpensesType = (props: ExpensesProps) => h.JSX.Element;

const Expenses: ExpensesType = observer(({ classes }: ExpensesProps) => {
	const { expenses, createExpense, updateExpense, removeExpense } = useExpenseStore();

	return (
		<div class={classes}>
			{expenses.map(item => (
				<ExpenseItem
					key={item.id}
					item={item}
					onChange={updateExpense}
					deleteItem={removeExpense}
				/>
			))}
			<Button color="teal" onClick={() => createExpense()}>
				Add
			</Button>
		</div>
	);
});

export default Expenses;
