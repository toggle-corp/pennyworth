import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';


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


export default class FloatingActionButton extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            styles.floatingActionButton,
            'floatingActionButton',
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
            <button
                {...otherProps}
                className={className}
                type="button"
            >
                { content }
            </button>
        );
    }
}
