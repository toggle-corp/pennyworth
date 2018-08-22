import { combineReducers } from 'redux';
import auth from './auth';
import categories from './categories';
import activities from './activities';

export default combineReducers({
    auth,
    categories,
    activities,
});
