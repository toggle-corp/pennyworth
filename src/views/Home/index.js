import React from 'react';

import Header from '#components/Header';
import NavBar from '#components/NavBar';
import Dashboard from '#views/Dashboard';
import Activity from '#views/Activity';

import styles from './styles.scss';

const Empty = () => null;

const pages = [
    { key: 'dashboard', title: 'Dashboard', page: Dashboard },
    { key: 'activity', title: 'Activity', page: Activity },
    { key: 'categories', title: 'Categories', page: Empty },
    { key: 'settings', title: 'Settings', page: Empty },
];

export default class Home extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            activePage: 'dashboard',
        };
    }

    handlePageChange = (activePage) => {
        this.setState({ activePage });
    }

    render() {
        const { activePage } = this.state;
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
