import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FloatingActionLink from '#components/FloatingActionLink';
import Rings from '#components/Rings';
import Bars from '#components/Bars';

import {
    incomeSelector,
    expenseSelector,
    estimationListSelector,
} from '#redux/combined';

import styles from './styles.scss';


const propTypes = {
    income: PropTypes.number.isRequired,
    expense: PropTypes.number.isRequired,
    estimationList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
    income: incomeSelector(state),
    expense: expenseSelector(state),
    estimationList: estimationListSelector(state),
});


@connect(mapStateToProps)
export default class Dashboard extends React.PureComponent {
    static propTypes = propTypes;

    renderSummary = () => {
        const {
            income,
            expense,
        } = this.props;

        const rings = [
            { key: 'income', amount: income, className: styles.income },
            { key: 'expense', amount: expense, className: styles.expense },
        ];

        return (
            <div className={styles.summary}>
                <Rings className={styles.rings} rings={rings} />
                <div className={styles.table}>
                    <div className={styles.income}>
                        <span className={styles.label}> Total Income </span>
                        <span className={styles.amount}> {income} </span>
                    </div>
                    <div className={styles.expense}>
                        <span className={styles.label}> Total Expense </span>
                        <span className={styles.amount}> {expense} </span>
                    </div>
                </div>
            </div>
        );
    }

    renderEstimations = () => {
        const planned = this.props.estimationList
            .reduce((acc, c) => acc + (c.plannedAmount || 0), 0);
        const actual = this.props.estimationList
            .reduce((acc, c) => acc + (c.actualAmount || 0), 0);

        const bars = [
            { key: 'Planned', amount: planned, className: styles.planned },
            { key: 'Actual', amount: actual, className: styles.actual },
        ];

        return (
            <Bars
                className={styles.estimations}
                bars={bars}
            />
        );
    }

    render() {
        const Summary = this.renderSummary;
        const Estimations = this.renderEstimations;

        return (
            <div className={styles.dashboard}>
                <div className={styles.body}>
                    <Summary />
                    <Estimations />
                </div>
                <FloatingActionLink
                    to={{
                        pathname: '/edit-activity/',
                        state: { fromApp: true },
                    }}
                />
            </div>
        );
    }
}
