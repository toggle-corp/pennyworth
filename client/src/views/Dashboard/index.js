import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormattedDate from '#rscv/FormattedDate/FormattedDate';

import sampleAvatar from '#images/sample-avatar.png';
import FloatingActionLink from '#components/FloatingActionLink';
import Rings from '#components/Rings';
import Sparkline from '#components/Sparkline';
import Bars from '#components/Bars';

import {
    incomeSelector,
    expenseSelector,
    incomeSeriesSelector,
    expenseSeriesSelector,
    estimationListSelector,
} from '#redux/combined';

import styles from './styles.scss';


const propTypes = {
    income: PropTypes.number.isRequired,
    expense: PropTypes.number.isRequired,
    incomeSeries: PropTypes.arrayOf(PropTypes.shape({
        time: PropTypes.instanceOf(Date),
        amount: PropTypes.number,
    })).isRequired,
    expenseSeries: PropTypes.arrayOf(PropTypes.shape({
        time: PropTypes.instanceOf(Date),
        amount: PropTypes.number,
    })).isRequired,
    estimationList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
    income: incomeSelector(state),
    expense: expenseSelector(state),
    incomeSeries: incomeSeriesSelector(state),
    expenseSeries: expenseSeriesSelector(state),
    estimationList: estimationListSelector(state),
});


const formatDate = date => FormattedDate.format(date, 'MMM dd');

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
                <div className={styles.avatar}>
                    <img src={sampleAvatar} alt="avatar" />
                </div>
                <div className={styles.table}>
                    <div className={styles.income}>
                        <span className={styles.amount}> {income} </span>
                        <span className={styles.label}> Total Income </span>
                    </div>
                    <div className={styles.expense}>
                        <span className={styles.amount}> {expense} </span>
                        <span className={styles.label}> Total Expense </span>
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
            <div className={styles.estimations}>
                <div className={styles.planned}>
                    <span className={styles.amount}> {planned} </span>
                    <span className={styles.label}> Planned </span>
                </div>
                <Bars
                    className={styles.bars}
                    bars={bars}
                />
                <div className={styles.actual}>
                    <span className={styles.amount}> {actual} </span>
                    <span className={styles.label}> Actual </span>
                </div>
            </div>
        );
    }

    renderTimeseries = () => {
        const {
            incomeSeries,
            expenseSeries,
        } = this.props;

        return (
            <div className={styles.timeseries}>
                <Sparkline
                    className={styles.income}
                    data={incomeSeries}
                />
                <Sparkline
                    className={styles.expense}
                    data={expenseSeries}
                />
                <div className={styles.axis}>
                    <span className={styles.date}>
                        {formatDate(incomeSeries[0].time)}
                    </span>
                    <span className={styles.date}>
                        {formatDate(incomeSeries[incomeSeries.length - 1].time)}
                    </span>
                </div>
            </div>
        );
    }

    render() {
        const Summary = this.renderSummary;
        const Estimations = this.renderEstimations;
        const Timeseries = this.renderTimeseries;

        return (
            <div className={styles.dashboard}>
                <div className={styles.body}>
                    <Summary />
                    <Estimations />
                    <Timeseries />
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
