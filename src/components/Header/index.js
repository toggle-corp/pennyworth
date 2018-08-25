import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { iconNames } from '#rsk';
import styles from './styles.scss';


const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

export default class Header extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            styles.header,
            'header',
        ];

        return classNames.join(' ');
    }

    render() {
        const className = this.getClassName();
        return (
            <div className={className}>
                <h1>
                    Pennyworth
                </h1>
                <div className={styles.action}>
                    <Link
                        to={{
                            pathname: '/edit-activity/',
                            state: { fromApp: true },
                        }}
                    >
                        <span className={iconNames.add} />
                    </Link>
                    <Link
                        to={{
                            pathname: '/settings/',
                            state: { fromApp: true },
                        }}
                    >
                        <span className="ion-android-settings" />
                    </Link>
                </div>
            </div>
        );
    }
}
