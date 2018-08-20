import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from '#views/App';
import configureStore from '#config/store';
import configureFirebase from '#config/firebase';
import registerServiceWorker from './registerServiceWorker';


const { store, persistor } = configureStore();
configureFirebase();

const Root = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
