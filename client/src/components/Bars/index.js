import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    bars: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        amount: PropTypes.number,
        className: PropTypes.string,
    })),
};

const defaultProps = {
    className: '',
    bars: [],
};

const getMaxValue = memoize(bars => Math.max(...bars.map(r => r.amount)));

export default class Bars extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;


    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            'bars',
            styles.bars,
        ];

        return classNames.join(' ');
    }

    renderBar = (bar) => {
        const max = getMaxValue(this.props.bars);
        const width = (max === bar.amount) ? 100 : (bar.amount / max) * 100;

        const classNames = [
            'bar',
            styles.bar,
            bar.className,
        ];
        const className = classNames.join(' ');

        return (
            <div
                key={bar.key}
                className={className}
                style={{ width: `${width}%` }}
            />
        );
    }

    render() {
        const className = this.getClassName();
        return (
            <div className={className}>
                {this.props.bars.map(this.renderBar)}
            </div>
        );
    }
}
