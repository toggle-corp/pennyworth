import React from 'react';
import { connect } from 'react-redux';

import Header from '#components/Header';
import NavBar from '#components/NavBar';
import Dashboard from '#views/Dashboard';
import Activity from '#views/Activity';
import Categories from '#views/Categories';

import {
    homePageSelector,
    setHomePageAction,
} from '#redux/uiState';

import styles from './styles.scss';

const Empty = () => null;

const pages = [
    { key: 'dashboard', title: 'Dashboard', page: Dashboard },
    { key: 'activity', title: 'Activity', page: Activity },
    { key: 'categories', title: 'Categories', page: Categories },
    { key: 'settings', title: 'Settings', page: Empty },
];

const mapStateToProps = state => ({
    homePage: homePageSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setHomePage: params => dispatch(setHomePageAction(params)),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends React.PureComponent {
    handlePageChange = (homePage) => {
        this.props.setHomePage(homePage);
    }

    render() {
        const { homePage: activePage } = this.props;
        const CurrentPage = pages.find(p => p.key === activePage)
            .page;

        return (
            <div className={styles.home}>
                <Header className={styles.header} />
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
