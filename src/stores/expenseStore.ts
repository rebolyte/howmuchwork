import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { observable, computed, action } from 'mobx';

import { ExpenseItem } from '@models';
import { uniqueIdRandom } from '@utilities';

export class ExpenseEntity {
	@observable readonly id: string;
	@observable name = '';
	@observable amount = 0;

	constructor(item?: ExpenseItem) {
		if (item !== undefined) {
			this.id = item.id;
			this.name = item.name;
			this.amount = item.amount;
		} else {
			this.id = uniqueIdRandom();
		}
	}
}

export class ExpenseStore {
	expenseRegistry = observable.map<string, ExpenseEntity>();

	constructor() {
		this.createExpense();
	}

	@computed get expenses() {
		return Array.from(this.expenseRegistry.values());
	}

	@computed get isEmpty() {
		return this.expenses.length === 0;
	}

	@action
	reset = () => {
		this.expenseRegistry.clear();
	};

	expenseById = (id: string) => this.expenseRegistry.get(id);

	@action
	createExpense = () => {
		const entity = new ExpenseEntity();
		this.expenseRegistry.set(entity.id, entity);
	};

	@action
	updateExpense = ({ id, name, amount }: ExpenseEntity) => {
		if (this.expenseRegistry.get(id) === undefined) {
			throw new Error('item not found');
		} else {
			this.expenseRegistry.set(id, new ExpenseEntity({ id, name, amount }));
		}
	};

	@action
	removeExpense = ({ id }: ExpenseEntity) => {
		this.expenseRegistry.delete(id);
	};
}

export const expenseStore = new ExpenseStore();

export const expenseStoreContext = createContext<ExpenseStore | null>(null);

export const useExpenseStore = () => {
	const store = useContext(expenseStoreContext);
	if (!store) {
		throw new Error('You forgot to use ExpenseStoreProvider!');
	}
	return store;
};
