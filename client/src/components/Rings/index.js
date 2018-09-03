import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { describeArc } from '#utils/common';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    rings: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        amount: PropTypes.number,
        className: PropTypes.string,
    })),
};

const defaultProps = {
    className: '',
    rings: [],
};

const getMaxValue = memoize(rings => Math.max(...rings.map(r => r.amount)));

export default class Rings extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;


    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            'rings',
            styles.rings,
        ];

        return classNames.join(' ');
    }

    renderRing = (ring, index) => {
        const max = getMaxValue(this.props.rings);
        const angle = (max === ring.amount) ? 359.999 : (ring.amount / max) * 360;
        const path = describeArc(50, 50, 48 - (index * 3), 0, angle);

        const classNames = [
            'ring',
            styles.ring,
            ring.className,
        ];
        const className = classNames.join(' ');

        return (
            <path
                key={ring.key}
                className={className}
                d={path}
            />
        );
    }

    render() {
        const className = this.getClassName();
        return (
            <svg
                className={className}
                viewBox="0 0 100 100"
            >
                {this.props.rings.map(this.renderRing)}
            </svg>
        );
    }
}
