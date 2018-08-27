import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FloatingActionLink from '#components/FloatingActionLink';
import {
    incomeSelector,
    expenseSelector,
} from '#redux/combined';

import { describeArc } from '#utils/common';
import styles from './styles.scss';


const propTypes = {
    income: PropTypes.number.isRequired,
    expense: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    income: incomeSelector(state),
    expense: expenseSelector(state),
});


@connect(mapStateToProps)
export default class Dashboard extends React.PureComponent {
    static propTypes = propTypes;

    renderRings = () => {
        const {
            income,
            expense,
        } = this.props;

        let incomeAngle;
        let expenseAngle;

        if (income > expense) {
            incomeAngle = 359.99;
            expenseAngle = (expense / income) * 360;
        } else {
            expenseAngle = 359.99;
            incomeAngle = (income / expense) * 360;
        }

        const incomePath = describeArc(100, 100, 80, 0, incomeAngle);
        const expensePath = describeArc(100, 100, 65, 0, expenseAngle);

        return (
            <div className={styles.rings}>
                <svg width="200" height="200">
                    <path
                        className={styles.incomeRing}
                        d={incomePath}
                    />
                    <path
                        className={styles.expenseRing}
                        d={expensePath}
                    />
                </svg>
                <div className={styles.summary}>
                    <div className={styles.income}>
                        <span> Income </span>
                        <span className={styles.amount}> {income} </span>
                    </div>
                    <div className={styles.expense}>
                        <span> Expense </span>
                        <span className={styles.amount}> {expense} </span>
                    </div>
                </div>
            </div>
        );
    }

    renderPlanVsActual = () => {
        const planned = 0;
        const actual = 200;

        if (planned === 0) {
            return null;
        }

        let plannedWidth;
        let actualWidth;

        if (planned > actual) {
            plannedWidth = 100;
            actualWidth = (actual / planned) * 100;
        } else {
            actualWidth = 100;
            plannedWidth = (planned / actual) * 100;
        }

        return (
            <div className={styles.plannedVsActual}>
                <div className={styles.planned}>
                    <div className={styles.summary}>
                        <div className={styles.label}> Planned </div>
                        <div className={styles.amount}> {planned} </div>
                    </div>
                    <div className={styles.bar} style={{ width: `${plannedWidth}%` }} />
                </div>
                <div className={styles.actual}>
                    <div className={styles.summary}>
                        <div className={styles.label}> Actual </div>
                        <div className={styles.amount}> {actual} </div>
                    </div>
                    <div className={styles.bar} style={{ width: `${actualWidth}%` }} />
                </div>
            </div>
        );
    }

    render() {
        const Rings = this.renderRings;
        const PlanVsActual = this.renderPlanVsActual;

        return (
            <div className={styles.dashboard}>
                <div className={styles.body}>
                    <Rings />
                    <PlanVsActual />
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
