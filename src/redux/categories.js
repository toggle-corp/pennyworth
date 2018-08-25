import { createSelector } from 'reselect';
import update from '#rsu/immutable-update';
import { randomString, pick } from '#rsu/common';
import createReducer from './create-reducer';

const initialData = {
    categories: {
        1: { title: 'Income', flow: 'in' },
        2: { title: 'Rent', flow: 'out' },
        3: { title: 'Food', flow: 'out' },
        4: { title: 'Travel', flow: 'out' },
        5: { title: 'Shopping', flow: 'out' },
        6: { title: 'Other Expense', flow: 'out' },
    },
};

export const allCategoriesSelector = ({ categories }) => categories.categories;
export const allCategoryListSelector = createSelector(
    allCategoriesSelector,
    categories => Object.keys(categories).map(id => ({
        id,
        ...categories[id],
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
    categories => Object.keys(categories).map(id => ({
        id,
        ...categories[id],
    })),
);


const ADD_CATEGORY = 'categories/ADD_CATEGORY';
const EDIT_CATEGORY = 'categories/EDIT_CATEGORY';
const REMOVE_CATEGORY = 'categories/REMOVE_CATEGORY';

export const addCategoryAction = ({ title, flow }) => ({
    type: ADD_CATEGORY,
    title,
    flow,
});

export const editCategoryAction = ({ id, title, flow, sync = false }) => ({
    type: EDIT_CATEGORY,
    id,
    title,
    flow,
    sync,
});

export const removeCategoryAction = ({ id, sync = false }) => ({
    type: REMOVE_CATEGORY,
    id,
    sync,
});

const addCategory = (state, action) => {
    const { title, flow } = action;
    const newId = randomString();
    const settings = {
        categories: { $auto: {
            [newId]: { $set: {
                title,
                flow,
                sync: false,
            } },
        } },
    };
    return update(state, settings);
};

const editCategory = (state, action) => {
    const { id, title, flow, sync } = action;
    const settings = {
        categories: { $auto: {
            [id]: { $set: {
                title,
                flow,
                sync,
            } },
        } },
    };
    return update(state, settings);
};

const removeCategory = (state, action) => {
    const { id, sync } = action;
    if (sync) {
        const settings = {
            categories: { $auto: {
                $unset: [id],
            } },
        };
        return update(state, settings);
    }

    const settings = {
        categories: { $auto: {
            [id]: { $merge: {
                deleted: true,
                sync: false,
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
