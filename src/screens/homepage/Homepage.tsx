import { h } from 'preact';
import { isEmpty } from 'lodash-es';

import { Calendar } from '@components';
import { DocumentTitle, useOnMount, fillArray, sumVals } from '@utilities';

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

	// Take a map of values, and split those values across a given length

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
};

const Homepage = () => {
	useOnMount(() => {
		genExpensesInDays(periodLength, amountMade, expenses);
	});

	return (
		<div>
			<DocumentTitle title="Home" />
			<div>Homepage</div>
			<Calendar entries={entries} />
		</div>
	);
};

export default Homepage;
