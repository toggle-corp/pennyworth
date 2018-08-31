import update from '#rsu/immutable-update';
import createReducer from './create-reducer';

const initialData = {
    tokens: {},
    user: undefined,
};

export const userSelector = ({ auth }) => auth.user;
export const tokensSelector = ({ auth }) => auth.tokens || {};

const SET_USER = 'auth/SET_USER';
const SET_TOKENS = 'auth/SET_TOKENS';
const LOGOUT = 'auth/LOGOUT';

export const setUserAction = user => ({
    type: SET_USER,
    user,
});

export const setTokensAction = ({ access, refresh }) => ({
    type: SET_TOKENS,
    access,
    refresh,
});

export const logoutAction = () => ({
    type: LOGOUT,
});

const setUser = (state, action) => {
    const settings = {
        user: { $set: action.user },
    };
    return update(state, settings);
};

const setTokens = (state, action) => {
    const { access, refresh } = action;
    const settings = {
        tokens: { $set: {
            access,
            refresh,
        } },
    };

    return update(state, settings);
};

const logout = (state) => {
    const settings = {
        user: { $set: undefined },
        tokens: { $set: {} },
    };

    return update(state, settings);
};

export default createReducer({
    [SET_USER]: setUser,
    [SET_TOKENS]: setTokens,
    [LOGOUT]: logout,
}, initialData);
