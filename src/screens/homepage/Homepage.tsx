import { h } from 'preact';
import { useState } from 'preact/hooks';
import { isEmpty } from 'lodash-es';

import { Card, Button, Calendar, TextInput, Select } from '@components';
import { DocumentTitle, useOnMount, fillArray, sumVals } from '@utilities';

import Expenses from './Expenses';

const entries = [
	{
		date: new Date(),
		items: [{ name: 'rent', percent: 0.75 }]
	}
];

const amountMade = 2000; // dollars
const periodLength = 20; // days - M-F of one month
const expenses = {
	rent: 500,
	gas: 75,
	restaurants: 140,
	gifts: 35,
	travel: 130,
	electric: 150,
	xbox: 325,
	muffins: 10,
	donuts: 12,
	other: 123
};

interface StringNum {
	[key: string]: number;
}

const genExpensesInDays = (periodLength: number, amountMade: number, expenses: StringNum) => {
	const expensesInDays: StringNum = Object.entries(expenses).reduce((acc: StringNum, [k, v]) => {
		const percentOfTotal = v / amountMade;
		const percentOfDays = periodLength * percentOfTotal;
		acc[k] = percentOfDays;
		return acc;
	}, {});

	console.log(expensesInDays);

	const days = fillArray(periodLength, {}).map((day: StringNum, _i) => {
		while (sumVals(day) < 1) {
			if (isEmpty(expensesInDays)) {
				break;
			}

			const [[curKey, curVal], [nextKey = 'default', nextVal = 0] = []] = Object.entries(
				expensesInDays
			);

			// If expense covers one day, fill it and remove expense
			if (curVal === 1) {
				day[curKey] = 1;
				delete expensesInDays[curKey];
			}

			// If expense spans multiple days, just fill the day and decrement expense value
			if (curVal > 1) {
				day[curKey] = 1;
				expensesInDays[curKey]--;
			}

			// If expense covers less than a day...
			if (curVal < 1) {
				const sum = sumVals(day);

				// ...and adding it the day would spill over...
				if (sum + curVal >= 1) {
					// subtract what will fit in the day and add it
					const diff = 1 - sum;
					day[curKey] = diff;
					expensesInDays[curKey] = curVal - diff;
				}
				// ...and the next value won't fit...
				else if (sum + nextVal >= 1) {
					// add the current expense, as well as what will fit of next expense so we fill the day
					day[curKey] = curVal;
					const diff = 1 - sumVals(day);
					day[nextKey] = diff;
					expensesInDays[nextKey] = nextVal - diff;
					delete expensesInDays[curKey];
				}
				// Otherwise we know it fits, so put it in the day
				else {
					day[curKey] = curVal;
					delete expensesInDays[curKey];
				}
			}
		}

		return day;
	});

	console.log(days);

	return days;
};

const Homepage = () => {
	useOnMount(() => {});

	const [month, setMonth] = useState(0);
	const [year, setYear] = useState(2019);
	const [income, setIncome] = useState(0);

	const handleMonthChange = (val: string) => {
		setMonth(parseInt(val));
	};

	const handleYearChange = (val: string) => {
		setYear(parseInt(val));
	};

	const handleIncomeChange = (val: string) => {
		setIncome(parseInt(val));
	};

	const handleSubmit = (evt: Event) => {
		evt.preventDefault();
		genExpensesInDays(periodLength, amountMade, expenses);
		console.log(month, year, income);
	};

	return (
		<div>
			<DocumentTitle title="Home" />
			<Card>
				<form onSubmit={handleSubmit} class="flex">
					<div class="mr-4">
						<div className="mb-2">
							<label className="form-label">Month</label>
							<Select
								options={[
									{ value: '0', name: ' January' },
									{ value: '1', name: ' February' },
									{ value: '2', name: ' March' },
									{ value: '3', name: ' April' },
									{ value: '4', name: ' May' },
									{ value: '5', name: ' June' },
									{ value: '6', name: ' July' },
									{ value: '7', name: ' August' },
									{ value: '8', name: ' September' },
									{ value: '9', name: ' October' },
									{ value: '10', name: ' November' },
									{ value: '11', name: ' December' }
								]}
								onChange={handleMonthChange}
							/>
						</div>
						<div className="mb-2">
							<label className="form-label">Year</label>
							<TextInput
								type="number"
								placeholder="2019"
								value="2019"
								onChange={handleYearChange}
							/>
						</div>
						<div className="mb-2">
							<label className="form-label">Monthly Income</label>
							<TextInput type="number" onChange={handleIncomeChange} />
						</div>
						<Button type="submit" color="green">
							Visualize
						</Button>
						<Button color="gray" classes="ml-2">
							Reset
						</Button>
					</div>
					<div>
						<Expenses />
					</div>
				</form>
			</Card>
			<Calendar entries={entries} />
		</div>
	);
};

export default Homepage;
