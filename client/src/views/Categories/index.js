import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { iconNames } from '#rsk';
import { categorySortedListSelector } from '#redux/categories';
import styles from './styles.scss';


const propTypes = {
    categoryList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
    categoryList: categorySortedListSelector(state),
});

@connect(mapStateToProps)
export default class Categories extends React.PureComponent {
    static propTypes = propTypes;

    renderItem = category => (
        <Link
            to={{
                pathname: `/edit-category/${category.key}/`,
                state: { fromApp: true },
            }}
            key={category.key}
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
                <div className={styles.header}>
                    <h1>
                        Categories
                    </h1>
                    <Link
                        to={{
                            pathname: '/edit-category/',
                            state: { fromApp: true },
                        }}
                    >
                        <span className={iconNames.add} />
                    </Link>
                </div>
                <div>
                    {this.props.categoryList.map(this.renderItem)}
                </div>
            </div>
        );
    }
}
