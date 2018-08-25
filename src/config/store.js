import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../redux';

const persistConfig = {
    key: 'pennyworth',
    storage,
    blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
    const store = createStore(persistedReducer);
    const persistor = persistStore(store);
    return { store, persistor };
};
