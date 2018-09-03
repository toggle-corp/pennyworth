import { combineReducers } from 'redux';
import auth from './auth';
import categories from './categories';
import activities from './activities';
import uiState from './uiState';

export default combineReducers({
    auth,
    categories,
    activities,
    uiState,
});
