import { createSelector } from 'reselect';
import { categoriesSelector, categoryListSelector } from './categories';
import { activityListSelector } from './activities';


export const incomeSelector = createSelector(
    categoriesSelector,
    activityListSelector,
    (categories, activityList) => activityList.reduce(
        (acc, a) => {
            const category = categories[a.category];
            if (category && category.activityType === 'income') {
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
            if (category && category.activityType === 'expense') {
                return acc + a.amount;
            }
            return acc;
        },
        0,
    ),
);

export const estimationListSelector = createSelector(
    categoryListSelector,
    activityListSelector,
    (categoryList, activityList) => categoryList
        .filter(c => c.activityType === 'expense')
        .map(
            c => ({
                ...c,
                actualAmount: c.plannedAmount === 0 ? 0 : activityList
                    .filter(a => a.category === c.key)
                    .reduce((acc, a) => acc + a.amount, 0),
            }),
        ),
);
