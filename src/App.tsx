import { h } from 'preact';
import { Router, Link } from 'preact-router';

import { Homepage, AboutPage } from '@screens';
import { StoreProvider } from '@utilities';
import { expenseStore, expenseStoreContext } from '@stores';

const App = () => (
	<StoreProvider store={expenseStore} storeContext={expenseStoreContext}>
		<main class="bg-gray-200 flex flex-col min-h-full">
			<nav class="flex items-center justify-between flex-wrap bg-blue-500 shadow px-6 py-4">
				<div class="flex items-center flex-shrink-0 text-white mr-6">
					<Link href="/" class="text-blue-200 hover:text-white hover:no-underline">
						HMW
					</Link>
				</div>
				<div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
					<div class="text-md lg:flex-grow">
						<Link
							href="/"
							activeClassName="underline"
							class="block inline-block mt-0 mr-6 text-blue-200 hover:text-white"
						>
							Home
						</Link>
						<Link
							href="/about"
							activeClassName="underline"
							class="block inline-block mt-0 mr-6 text-blue-200 hover:text-white"
						>
							About
						</Link>
					</div>
					<div class="flex items-center text-blue-200">
						<a
							href="https://github.com/rebolyte/howmuchwork"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-200 hover:text-white"
						>
							Source
						</a>
					</div>
				</div>
			</nav>
			<div class="container mx-auto flex-1 px-2 md:px-8 mt-4">
				<Router>
					<Homepage path="/" />
					<AboutPage path="/about" />
				</Router>
			</div>
			<footer className="bg-gray-400 shadow mt-4 px-6 py-4">
				Copyright &copy; 2019 James Irwin
			</footer>
		</main>
	</StoreProvider>
);

export default App;
