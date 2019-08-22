import { h } from 'preact';
import { useState } from 'preact/hooks';
import { observer } from 'mobx-preact';

import { Card, Button, TextInput, Select, Calendar } from '@components';
import { DocumentTitle, weekdaysInMonth } from '@utilities';
import { useExpenseStore } from '@stores';

import Expenses from './Expenses';

// Have to be explicit because mobx-preact doesn't have typings, so using `observer` makes it `any`
export type HomepageType = () => h.JSX.Element;

const Homepage: HomepageType = observer(() => {
	const { expenses, expensesInDays } = useExpenseStore();

	const [month, setMonth] = useState(0);
	const [year, setYear] = useState(2019);
	const [income, setIncome] = useState(0);
	const [entries, setEntries] = useState<{ [name: string]: number }[]>([]);

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
		const numWeekdays = weekdaysInMonth(new Date(year, month, 1)).length;
		if (expenses.length > 0) {
			const inDays = expensesInDays(numWeekdays, income);
			setEntries(inDays);
		}
	};

	const renderDay = (day: number) => {
		const exp = entries[day - 1];
		// var propDataName = prop.replace(/\s+/g, '-').toLowerCase();
		// var sizeStyle = expensesPerDayObj[dayObj][prop] < 0.2 ? ' font-size: 8pt;' : '';

		if (exp) {
			return (
				<div>
					{Object.entries(exp).map(([k, v]) => (
						/* stylelint-disable-next-line declaration-block-trailing-semicolon */
						<span key={k} style={{ height: v * 100 + '%;' }}>
							{k}
						</span>
					))}
				</div>
			);
		}
		return <div></div>;
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
			<Calendar year={year} month={month} renderDay={renderDay} />
		</div>
	);
});

export default Homepage;
