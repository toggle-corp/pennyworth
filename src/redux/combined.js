import { createSelector } from 'reselect';
import { categoriesSelector } from './categories';
import { activityListSelector } from './activities';


export const incomeSelector = createSelector(
    categoriesSelector,
    activityListSelector,
    (categories, activityList) => activityList.reduce(
        (acc, a) => {
            const category = categories[a.category];
            if (category && category.flow === 'in') {
                return acc + a.amount;
            }
            return acc;
        },
        0,
    ),
);

export const expenseSelector = createSelector(
    categoriesSelector,
    activityListSelector,
    (categories, activityList) => activityList.reduce(
        (acc, a) => {
            const category = categories[a.category];
            if (category && category.flow === 'out') {
                return acc + a.amount;
            }
            return acc;
        },
        0,
    ),
);
