import { createSelector } from 'reselect';
import update from '#rsu/immutable-update';
import { randomString } from '#rsu/common';
import createReducer from './create-reducer';

const initialData = {
    activities: {},
};

export const activitiesSelector = ({ activities }) => activities.activities;
export const activityListSelector = createSelector(
    activitiesSelector,
    activities => Object.keys(activities).map(id => ({
        id,
        ...activities[id],
    })),
);
export const activitySortedListSelector = createSelector(
    activityListSelector,
    activityList => activityList.sort((a, b) => (
        b.createdAt - a.createdAt
    )),
);


const ADD_ACTIVITY = 'activities/ADD_ACTIVITY';
const EDIT_ACTIVITY = 'activities/EDIT_ACTIVITY';
const REMOVE_ACTIVITY = 'activities/REMOVE_ACTIVITY';

export const addActivityAction = ({ title, amount, category, date }) => ({
    type: ADD_ACTIVITY,
    title,
    amount: +amount,
    category,
    date,
});

export const editActivityAction = ({ id, title, amount, category, date }) => ({
    type: EDIT_ACTIVITY,
    id,
    title,
    amount: +amount,
    category,
    date,
});

export const removeActivityAction = ({ id }) => ({
    type: REMOVE_ACTIVITY,
    id,
});

const addActivity = (state, action) => {
    const { title, amount, category, date } = action;
    const newId = randomString();
    const settings = {
        activities: { $auto: {
            [newId]: { $set: {
                title,
                amount,
                category,
                date,
                createdAt: Date.now(),
            } },
        } },
    };
    return update(state, settings);
};

const editActivity = (state, action) => {
    const { id, title, amount, category, date } = action;
    const settings = {
        activities: { $auto: {
            [id]: { $set: {
                title,
                amount,
                category,
                date,
            } },
        } },
    };
    return update(state, settings);
};

const removeActivity = (state, action) => {
    const { id } = action;
    const settings = {
        activities: { $auto: {
            $unset: [id],
        } },
    };
    return update(state, settings);
};

export default createReducer({
    [ADD_ACTIVITY]: addActivity,
    [EDIT_ACTIVITY]: editActivity,
    [REMOVE_ACTIVITY]: removeActivity,
}, initialData);
