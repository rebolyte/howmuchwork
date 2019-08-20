import { useEffect } from 'preact/hooks';

export function useOnMount(f: () => void | (() => void)) {
	useEffect(f, []);
}
