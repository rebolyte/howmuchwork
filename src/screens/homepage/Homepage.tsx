import { h } from 'preact';
import { useState } from 'preact/hooks';
import { observer } from 'mobx-preact';
// @ts-ignore
import randomColor from 'randomcolor';
// @ts-ignore
import injectCss from 'inject-css';
import { kebabCase } from 'lodash-es';
import classNames from 'classnames';

import { Card, Button, TextInput, Select, Calendar } from '@components';
import { DocumentTitle, weekdaysInMonth, isWeekday } from '@utilities';
import { useExpenseStore } from '@stores';
import { ExpensesForDay } from '@models';

import Expenses from './Expenses';

// Have to be explicit because mobx-preact doesn't have typings, so using `observer` makes it `any`
export type HomepageType = () => h.JSX.Element;

const Homepage: HomepageType = observer(() => {
	const { expenses, reset: resetExpenses, expensesInDays } = useExpenseStore();

	const [month, setMonth] = useState(0);
	const [year, setYear] = useState(2019);
	const [income, setIncome] = useState(0);
	const [entries, setEntries] = useState<ExpensesForDay[]>([]);
	const [hoverClass, setHovering] = useState('');

	const handleMonthChange = (val: string) => {
		setMonth(parseInt(val));
	};

	const handleYearChange = (val: string) => {
		setYear(parseInt(val));
	};

	const handleIncomeChange = (val: string) => {
		setIncome(parseInt(val));
	};

	let n = 0;

	const renderCalendar = () => {
		n = 0;
		const numWeekdays = weekdaysInMonth(new Date(year, month, 1)).length;
		const hasEmpty = expenses.some(exp => isNaN(exp.amount));

		if (income > 0 && expenses.length > 0 && !hasEmpty) {
			const inDays = expensesInDays(numWeekdays, income);
			setEntries(inDays);

			const colors = randomColor({
				hue: 'green',
				luminosity: 'dark',
				count: expenses.length
			});

			expenses.forEach((exp, idx) => {
				// TODO: Clean the generated CSS that we add to <head> on submit
				const selector = `table.calendar td > div > span.${kebabCase(exp.name)}`;
				injectCss(`${selector} { background-color: ${colors[idx]}; }`);
			});
		}
	};

	const handleSubmit = (evt: Event) => {
		evt.preventDefault();
		renderCalendar();
	};

	const renderDay = (day: number) => {
		if (isWeekday(new Date(year, month, day)) && entries[n]) {
			return (
				<div class="h-full">
					{Object.entries(entries[n++]).map(([k, v]) => {
						const kebab = kebabCase(k);
						const classes = classNames('block w-full', 'text-white', kebab, {
							'text-xs': v < 0.2,
							'opacity-85': hoverClass === kebab
						});

						return (
							<span
								key={k}
								class={classes}
								style={{ height: v * 100 + '%' }}
								onMouseOver={() => setHovering(kebab)}
								onMouseOut={() => setHovering('')}
							>
								{k}
							</span>
						);
					})}
				</div>
			);
		}
		return <div></div>;
	};

	const reset = () => {
		const d = new Date();
		setMonth(d.getMonth());
		setYear(d.getFullYear());
		setIncome(0);
		resetExpenses();
		renderCalendar();
	};

	return (
		<div>
			<DocumentTitle title="Home" />
			<Card>
				<form onSubmit={handleSubmit} class="flex flex-col md:flex-row">
					<div class="mr-4">
						<h2 class="text-2xl mb-2">Enter Info</h2>
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
								value={String(new Date().getMonth())}
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
							<TextInput type="number" value={String(income)} onChange={handleIncomeChange} />
						</div>
						<Button type="submit" color="green">
							Visualize
						</Button>
						<Button color="gray" classes="ml-2" onClick={reset}>
							Reset
						</Button>
					</div>
					<div class="mt-4 md:mt-0">
						<h2 class="text-2xl mb-2">Enter Expenses</h2>
						<Expenses />
					</div>
				</form>
			</Card>
			<Calendar year={year} month={month} renderDay={renderDay} />
		</div>
	);
});

export default Homepage;
