import { createSelector } from 'reselect';
import update from '#rsu/immutable-update';
import { randomString, pick } from '#rsu/common';
import createReducer from './create-reducer';

const initialData = {
    categories: {},
};

export const allCategoriesSelector = ({ categories }) => categories.categories;
export const allCategoryListSelector = createSelector(
    allCategoriesSelector,
    categories => Object.keys(categories).map(key => ({
        key,
        ...categories[key],
    })),
);

export const categoriesSelector = createSelector(
    allCategoriesSelector,
    categories => pick(
        categories,
        Object.keys(categories).filter(c => !categories[c].deleted),
    ),
);

export const categoryListSelector = createSelector(
    categoriesSelector,
    categories => Object.keys(categories).map(key => ({
        key,
        ...categories[key],
    })),
);


const ADD_CATEGORY = 'categories/ADD_CATEGORY';
const EDIT_CATEGORY = 'categories/EDIT_CATEGORY';
const REMOVE_CATEGORY = 'categories/REMOVE_CATEGORY';

export const addCategoryAction = ({ title, activityType, plannedAmount }) => ({
    type: ADD_CATEGORY,
    title,
    activityType,
    plannedAmount,
});

export const editCategoryAction = ({
    key, title, activityType, plannedAmount,
    createdAt, modifiedAt, sync = false,
}) => ({
    type: EDIT_CATEGORY,
    key,
    title,
    activityType,
    plannedAmount,
    createdAt,
    modifiedAt,
    sync,
});

export const removeCategoryAction = ({ key, sync = false }) => ({
    type: REMOVE_CATEGORY,
    key,
    sync,
});

const addCategory = (state, action) => {
    const { title, activityType, plannedAmount } = action;
    const newId = randomString(16);
    const settings = {
        categories: { $auto: {
            [newId]: { $set: {
                title,
                activityType,
                plannedAmount,
                sync: false,
            } },
        } },
    };
    return update(state, settings);
};

const editCategory = (state, action) => {
    const { key, title, activityType, plannedAmount, createdAt, modifiedAt, sync } = action;
    const settings = {
        categories: { $auto: {
            [key]: { $set: {
                title,
                activityType,
                plannedAmount,
                createdAt,
                modifiedAt,
                sync,
            } },
        } },
    };
    return update(state, settings);
};

const removeCategory = (state, action) => {
    const { key, sync } = action;
    const settings = {
        categories: { $auto: {
            [key]: { $merge: {
                deleted: true,
                sync,
            } },
        } },
    };
    return update(state, settings);
};

export default createReducer({
    [ADD_CATEGORY]: addCategory,
    [EDIT_CATEGORY]: editCategory,
    [REMOVE_CATEGORY]: removeCategory,
}, initialData);
