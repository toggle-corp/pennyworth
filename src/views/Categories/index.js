import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { categoryListSelector } from '#redux/categories';
import styles from './styles.scss';

const mapStateToProps = state => ({
    categoryList: categoryListSelector(state),
});
const emptyObject = {};

@connect(mapStateToProps)
export default class Categories extends React.PureComponent {
    renderItem = category => (
        <Link
            to={{
                pathname: `/edit-category/${category.id}/`,
                state: { fromApp: true },
            }}
            key={category.id}
            className={styles.item}
        >
            <div className={styles.summary}>
                <div className={styles.title}>
                    {category.title}
                </div>
            </div>
        </Link>
    )

    render() {
        return (
            <div className={styles.categories}>
                {this.props.categoryList.map(this.renderItem)}
                <Link
                    to={{
                        pathname: '/edit-category/',
                        state: { fromApp: true },
                    }}
                    className={styles.newItem}
                >
                    <span>
                        Add new category
                    </span>
                </Link>
            </div>
        );
    }
}
