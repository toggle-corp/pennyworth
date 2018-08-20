import React from 'react';
import styles from './styles.scss';


export default class Dashboard extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderHeader = () => (
        <div className={styles.header}>
            Pennyworth
        </div>
    )

    renderBody = () => (
        <div className={styles.body}>
            <div className={styles.summary}>
                <label>Total Income</label>
                <span>100$</span>
            </div>
            <div className={styles.summary}>
                <label>Total Expense</label>
                <span>105$</span>
            </div>
        </div>
    )

    renderFooter = () => (
        <div className={styles.footer}>
            <button>Add Income</button>
            <button>Add Expense</button>
        </div>
    )

    render() {
        const Header = this.renderHeader;
        const Body = this.renderBody;
        const Footer = this.renderFooter;

        return (
            <div className={styles.dashboard}>
                <Header />
                <Body />
                <Footer />
            </div>
        );
    }
}
