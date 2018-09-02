import React from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
    className: '',
    data: [],
};

export default class Sparkline extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.svgRef = React.createRef();
    }

    componentDidMount() {
        this.create(this.props.data);
    }

    componentWillReceiveProps(nextProps) {
        this.destroy();
        this.create(this.props.data);
    }

    componentWillUnmount() {
        this.destroy();
    }

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            'sparkline',
            styles.sparkline,
        ];

        return classNames.join(' ');
    }

    destroy = () => {
        if (this.g) {
            this.g.remove();
            this.g = undefined;
        }
    }

    create = (data) => {
        const svg = this.svgRef.current;
        this.g = d3.select(svg).append('g');

        const { width, height } = svg.getBoundingClientRect();
        const xScale = d3.scaleLinear().range([0, width]);
        const yScale = d3.scaleLinear().range([height, 0]);
        xScale.domain(d3.extent(data, d => d.time));
        yScale.domain(d3.extent(data, d => d.amount));

        const line = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.amount))
            .curve(d3.curveBasis);

        this.g.append('path')
            .datum(data)
            .attr('d', line);
    }

    render() {
        const className = this.getClassName();

        return (
            <svg
                ref={this.svgRef}
                className={className}
            />
        );
    }
}
