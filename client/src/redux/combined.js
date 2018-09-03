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


export const incomeSeriesSelector = createSelector(
    categoriesSelector,
    activityListSelector,
    (categories, activityList) => {
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();

        const startDate = new Date(y, m, 1);
        const endDate = new Date(y, m + 1, 0);

        const date = startDate;
        const series = [];
        while (date <= endDate) {
            const dateString = date.toLocaleDateString();
            const amount = activityList.filter(a => (
                new Date(a.date).toLocaleDateString() === dateString &&
                categories[a.category].activityType === 'income'
            )).reduce((acc, a) => acc + a.amount, 0);

            series.push({
                amount,
                time: new Date(date),
            });
            date.setDate(date.getDate() + 1);
        }

        return series;
    },
);
export const expenseSeriesSelector = createSelector(
    categoriesSelector,
    activityListSelector,
    (categories, activityList) => {
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();

        const startDate = new Date(y, m, 1);
        const endDate = new Date(y, m + 1, 0);

        const date = startDate;
        const series = [];
        while (date <= endDate) {
            const dateString = date.toLocaleDateString();
            const amount = activityList.filter(a => (
                new Date(a.date).toLocaleDateString() === dateString &&
                categories[a.category].activityType === 'expense'
            )).reduce((acc, a) => acc + a.amount, 0);

            series.push({
                amount,
                time: new Date(date),
            });
            date.setDate(date.getDate() + 1);
        }

        return series;
    },
);
