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
                <Link
                    to={{
                        pathname: '/edit-activity/',
                        state: { fromApp: true },
                    }}
                    className={styles.action}
                >
                    <span className={iconNames.add} />
                </Link>
            </div>
        );
    }
}
