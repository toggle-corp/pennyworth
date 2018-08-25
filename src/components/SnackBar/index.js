import React from 'react';
import PropTypes from 'prop-types';

import Portal from '#rscv/Portal';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

const defaultProps = {
    className: '',
};

export default class SnackBar extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            'snack-bar',
            styles.snackBar,
        ];

        return classNames.join(' ');
    }

    render() {
        const { children } = this.props;
        const className = this.getClassName();

        return (
            <Portal>
                <div className={className}>
                    { children }
                </div>
            </Portal>
        );
    }
}
