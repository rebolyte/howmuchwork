import { h, render } from 'preact';

import Homepage from './screens/homepage/Homepage';

import './styles/main.css';

const delay = (ms: number) => {
	return new Promise(r => setTimeout(r, ms));
};

(async () => {
	await delay(1500);
	console.log('here');
})();

render(
	<div>
		<div className="bg-black text-white">well hello there</div>
		<Homepage />
	</div>,
	document.body
);
