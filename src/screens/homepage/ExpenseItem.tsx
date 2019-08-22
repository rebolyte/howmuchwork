import { h } from 'preact';

import { TextInput } from '@components';

export interface ExpenseItemType {
	id: string;
	name: string;
	amount: number;
}

export interface ExpenseItemProps {
	item: ExpenseItemType;
	onChange: (item: ExpenseItemType) => any;
	deleteItem: (item: ExpenseItemType) => any;
	key?: string;
}

const ExpenseItem = ({ item, onChange, deleteItem, key }: ExpenseItemProps) => {
	return (
		<div key={key} class="flex items-center p-4 mb-2 rounded bg-gray-200">
			<span class="mr-2">Category</span>
			<TextInput
				value={item.name}
				placeholder="Rent"
				onChange={val => onChange({ ...item, name: val })}
				classes="mr-2"
			/>
			<span class="mr-2">$</span>
			<TextInput
				type="number"
				value={String(item.amount)}
				onChange={val => onChange({ ...item, amount: parseInt(val) })}
				classes="mr-2"
			/>
			<span class="icon-close cursor-pointer" onClick={() => deleteItem(item)}></span>
		</div>
	);
};

export default ExpenseItem;
