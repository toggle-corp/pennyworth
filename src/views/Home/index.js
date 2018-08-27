import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NavBar from '#components/NavBar';
import Dashboard from '#views/Dashboard';
import Activities from '#views/Activities';
import Categories from '#views/Categories';

import {
    homePageSelector,
    setHomePageAction,
} from '#redux/uiState';

import styles from './styles.scss';

const pages = [
    {
        key: 'dashboard',
        title: 'Dashboard',
        page: Dashboard,
        icon: 'ion-cube',
    },
    {
        key: 'activities',
        title: 'Activities',
        page: Activities,
        icon: 'ion-android-list',
    },
    {
        key: 'categories',
        title: 'Categories',
        page: Categories,
        icon: 'ion-android-folder',
    },
];


const propTypes = {
    homePage: PropTypes.string.isRequired,
    setHomePage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    homePage: homePageSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setHomePage: params => dispatch(setHomePageAction(params)),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends React.PureComponent {
    static propTypes = propTypes;

    handlePageChange = (homePage) => {
        this.props.setHomePage(homePage);
    }

    render() {
        const { homePage: activePage } = this.props;
        const CurrentPage = pages.find(p => p.key === activePage)
            .page;

        return (
            <div className={styles.home}>
                <div className={styles.body}>
                    <CurrentPage />
                </div>
                <NavBar
                    className={styles.navBar}
                    pages={pages}
                    value={activePage}
                    onChange={this.handlePageChange}
                />
            </div>
        );
    }
}
