import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './styles.scss';


const noOp = () => undefined;

const propTypes = {
    className: PropTypes.string,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
};

const defaultProps = {
    className: '',
    content: '+',
};


export default class FloatingActionLink extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            styles.floatingActionLink,
            'floatingActionLink',
        ];

        return classNames.join(' ');
    }

    render() {
        const {
            content,
            ...otherProps
        } = this.props;
        const className = this.getClassName();

        return (
            <Link
                {...otherProps}
                className={className}
            >
                { content }
            </Link>
        );
    }
}
