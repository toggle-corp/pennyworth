import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { activitySortedListSelector } from '#redux/activities';
import { categoriesSelector } from '#redux/categories';
import styles from './styles.scss';

const mapStateToProps = state => ({
    activityList: activitySortedListSelector(state),
    categories: categoriesSelector(state),
});
const emptyObject = {};

@connect(mapStateToProps)
export default class Activity extends React.PureComponent {
    renderItem = (activity) => {
        const category = this.props.categories[activity.category] || emptyObject;

        return (
            <Link
                to={{
                    pathname: `/edit-activity/${activity.id}/`,
                    state: { fromApp: true },
                }}
                key={activity.id}
                className={styles.item}
            >
                <div className={styles.summary}>
                    <div className={styles.title}>
                        {activity.title}
                    </div>
                    <div className={styles.category}>
                        {category.title}
                    </div>
                    <div className={styles.date}>
                        {activity.date}
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
                {this.props.activityList.map(this.renderItem)}
            </div>
        );
    }
}
