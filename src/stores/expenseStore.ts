import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { observable, computed, action } from 'mobx';
import { isEmpty } from 'lodash-es';

import { ExpenseItem } from '@models';
import { uniqueIdRandom, fillArray, sumVals } from '@utilities';

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

interface StringNum {
	[key: string]: number;
}

// const amountMade = 2000; // dollars
// const periodLength = 20; // days - M-F of one month
// const expenses_ = {
// 	rent: 500,
// 	gas: 75,
// 	restaurants: 140,
// 	gifts: 35,
// 	travel: 130,
// 	electric: 150,
// 	xbox: 325,
// 	muffins: 10,
// 	donuts: 12,
// 	other: 123
// };

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
		this.createExpense();
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

	expensesInDays = (periodLength: number, amountMade: number) => {
		const inDays: StringNum = this.expenses.reduce((acc: StringNum, { name, amount }) => {
			const percentOfTotal = amount / amountMade;
			const percentOfDays = periodLength * percentOfTotal;
			acc[name] = percentOfDays;
			return acc;
		}, {});

		const days = fillArray(periodLength, {}).map((day: StringNum, _i) => {
			while (sumVals(day) < 1) {
				if (isEmpty(inDays)) {
					break;
				}

				const [[curKey, curVal], [nextKey = 'default', nextVal = 0] = []] = Object.entries(inDays);

				// If expense covers one day, fill it and remove expense
				if (curVal === 1) {
					day[curKey] = 1;
					delete inDays[curKey];
				}

				// If expense spans multiple days, just fill the day and decrement expense value
				if (curVal > 1) {
					day[curKey] = 1;
					inDays[curKey]--;
				}

				// If expense covers less than a day...
				if (curVal < 1) {
					const sum = sumVals(day);

					// ...and adding it the day would spill over...
					if (sum + curVal >= 1) {
						// subtract what will fit in the day and add it
						const diff = 1 - sum;
						day[curKey] = diff;
						inDays[curKey] = curVal - diff;
					}
					// ...and the next value won't fit...
					else if (sum + nextVal >= 1) {
						// add the current expense, as well as what will fit of next expense so we fill the day
						day[curKey] = curVal;
						const diff = 1 - sumVals(day);
						day[nextKey] = diff;
						inDays[nextKey] = nextVal - diff;
						delete inDays[curKey];
					}
					// Otherwise we know it fits, so put it in the day
					else {
						day[curKey] = curVal;
						delete inDays[curKey];
					}
				}
			}

			return day;
		});

		return days;
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
