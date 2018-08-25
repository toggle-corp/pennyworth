import { createSelector } from 'reselect';
import update from '#rsu/immutable-update';
import { randomString, pick } from '#rsu/common';
import createReducer from './create-reducer';

const initialData = {
    activities: {},
};

export const allActivitiesSelector = ({ activities }) => activities.activities;
export const allActivityListSelector = createSelector(
    allActivitiesSelector,
    activities => Object.keys(activities).map(id => ({
        id,
        ...activities[id],
    })),
);

export const activitiesSelector = createSelector(
    allActivitiesSelector,
    activities => pick(
        activities,
        Object.keys(activities).filter(a => !activities[a].deleted),
    ),
);

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

export const editActivityAction = ({
    id, title, amount, category, date, createdAt, sync = false,
}) => ({
    type: EDIT_ACTIVITY,
    id,
    title,
    amount: +amount,
    category,
    date,
    createdAt,
    sync,
});

export const removeActivityAction = ({ id, sync = false }) => ({
    type: REMOVE_ACTIVITY,
    id,
    sync,
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
                sync: false,
            } },
        } },
    };
    return update(state, settings);
};

const editActivity = (state, action) => {
    const { id, title, amount, category, date, createdAt, sync } = action;
    const settings = {
        activities: { $auto: {
            [id]: { $set: {
                title,
                amount,
                category,
                date,
                createdAt,
                sync,
            } },
        } },
    };
    return update(state, settings);
};

const removeActivity = (state, action) => {
    const { id, sync } = action;
    if (sync) {
        const settings = {
            activities: { $auto: {
                $unset: [id],
            } },
        };
        return update(state, settings);
    }

    const settings = {
        activities: { $auto: {
            [id]: { $merge: {
                deleted: true,
                sync: false,
            } },
        } },
    };
    return update(state, settings);
};

export default createReducer({
    [ADD_ACTIVITY]: addActivity,
    [EDIT_ACTIVITY]: editActivity,
    [REMOVE_ACTIVITY]: removeActivity,
}, initialData);
