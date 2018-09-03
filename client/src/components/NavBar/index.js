import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';


const propTypes = {
    className: PropTypes.string,
    pages: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

const defaultProps = {
    className: '',
    pages: [],
    value: undefined,
};

export default class NavBar extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            styles.navBar,
            'navBar',
        ];

        return classNames.join(' ');
    }

    getButtonClassName = (page) => {
        const { value } = this.props;
        const classNames = [
            styles.pageButton,
            'page-button',
        ];

        if (value === page.key) {
            classNames.push(styles.active);
            classNames.push('active');
        }

        return classNames.join(' ');
    };

    renderPageButton = page => (
        <button
            className={this.getButtonClassName(page)}
            key={page.key}
            onClick={() => this.props.onChange(page.key)}
        >
            <span className={`${styles.icon} ${page.icon}`} />
            <span>
                {page.title}
            </span>
        </button>
    );

    render() {
        const className = this.getClassName();
        const { pages } = this.props;

        return (
            <div className={className}>
                {pages.map(this.renderPageButton)}
            </div>
        );
    }
}
