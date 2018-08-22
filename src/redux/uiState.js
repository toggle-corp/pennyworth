import update from '#rsu/immutable-update';
import createReducer from './create-reducer';

const initialData = {
    homePage: 'dashboard',
};

export const homePageSelector = ({ uiState }) => uiState.homePage;

const SET_HOME_PAGE = 'auth/SET_HOME_PAGE';

export const setHomePageAction = homePage => ({
    type: SET_HOME_PAGE,
    homePage,
});

const setHomePage = (state, action) => {
    const settings = {
        homePage: { $set: action.homePage },
    };
    return update(state, settings);
};

export default createReducer({
    [SET_HOME_PAGE]: setHomePage,
}, initialData);
