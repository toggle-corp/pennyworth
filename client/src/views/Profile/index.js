import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DangerButton from '#rsca/Button/DangerButton';

import {
    userSelector,
    logoutAction,
} from '#redux/auth';

import styles from './styles.scss';

const propTypes = {
    user: PropTypes.shape({}).isRequired,
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    user: userSelector(state),
});

const mapDispatchToProps = dispatch => ({
    logout: params => dispatch(logoutAction(params)),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends React.PureComponent {
    static propTypes = propTypes;

    handleLogoutClick = () => {
        this.props.logout();
    }

    render() {
        const { user } = this.props;
        return (
            <div className={styles.profile}>
                <p>
                    You are signed in as:
                </p>
                <h2>
                    {user.username}
                </h2>
                <h3>
                    {user.firstName} {user.lastName}
                </h3>
                <DangerButton
                    onClick={this.handleLogoutClick}
                    transparent
                >
                    Logout
                </DangerButton>
            </div>
        );
    }
}
