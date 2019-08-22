import { h, render } from 'preact';
import { configure } from 'mobx';

import './styles/main.css';

import App from './App';

// don't allow state modifications outside actions
configure({ enforceActions: 'observed' });

render(<App />, document.body);
