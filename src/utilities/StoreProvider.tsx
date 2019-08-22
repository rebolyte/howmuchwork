import { h, PreactContext, ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';

export function StoreProvider<T>({
	store: storeProp,
	storeContext,
	children
}: {
	store: any;
	storeContext: PreactContext<T>;
	children: ComponentChildren;
}) {
	const [store] = useState(storeProp);
	return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
}
