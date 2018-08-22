import update from '#rsu/immutable-update';
import createReducer from './create-reducer';

const initialData = {
    user: undefined,
};

export const userSelector = ({ auth }) => auth.user;

const SET_USER = 'auth/SET_USER';

export const setUserAction = user => ({
    type: SET_USER,
    user,
});

const setUser = (state, action) => {
    const settings = {
        user: { $set: action.user },
    };
    return update(state, settings);
};

export default createReducer({
    [SET_USER]: setUser,
}, initialData);
