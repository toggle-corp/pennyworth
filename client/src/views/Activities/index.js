import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { iconNames } from '#rsk';
import { activitySortedListSelector } from '#redux/activities';
import { categoriesSelector } from '#redux/categories';
import styles from './styles.scss';

const propTypes = {
    categories: PropTypes.objectOf(PropTypes.object).isRequired,
    activityList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
    activityList: activitySortedListSelector(state),
    categories: categoriesSelector(state),
});
const emptyObject = {};

@connect(mapStateToProps)
export default class Activities extends React.PureComponent {
    static propTypes = propTypes;

    renderItem = (activity) => {
        const category = this.props.categories[activity.category] || emptyObject;
        const classNames = [
            styles[category.activityType],
            styles.item,
        ];
        const className = classNames.join(' ');

        return (
            <Link
                to={{
                    pathname: `/edit-activity/${activity.key}/`,
                    state: { fromApp: true },
                }}
                key={activity.key}
                className={className}
            >
                <div className={styles.summary}>
                    <div className={styles.title}>
                        {activity.title}
                    </div>
                    <div className={styles.category}>
                        {category.title}
                    </div>
                    <div className={styles.date}>
                        {new Date(activity.date).toLocaleDateString()}
                    </div>
                </div>
                <div className={styles.amount}>
                    {activity.amount}
                </div>
            </Link>
        );
    }

    render() {
        return (
            <div className={styles.activity}>
                <div className={styles.header}>
                    <h1>
                        Activities
                    </h1>
                    <Link
                        to={{
                            pathname: '/edit-activity/',
                            state: { fromApp: true },
                        }}
                    >
                        <span className={iconNames.add} />
                    </Link>
                </div>
                <div>
                    {this.props.activityList.map(this.renderItem)}
                </div>
            </div>
        );
    }
}
