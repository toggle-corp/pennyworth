import React from 'react';
import { connect } from 'react-redux';
import {
    incomeSelector,
    expenseSelector,
} from '#redux/combined';
import styles from './styles.scss';

const mapStateToProps = state => ({
    income: incomeSelector(state),
    expense: expenseSelector(state),
});

@connect(mapStateToProps)
export default class Dashboard extends React.PureComponent {
    renderBody = () => (
        <div className={styles.body}>
            <div className={styles.summary}>
                <span>Total Income</span>
                <span>{this.props.income}</span>
            </div>
            <div className={styles.summary}>
                <span>Total Expense</span>
                <span>{this.props.expense}</span>
            </div>
        </div>
    )

    render() {
        const Body = this.renderBody;

        return (
            <div className={styles.dashboard}>
                <Body />
            </div>
        );
    }
}
