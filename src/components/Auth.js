import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import { connect } from 'react-redux';

import { pick } from '#rsu/common';
import {
    setUserAction,
    userSelector,
} from '#redux/auth';

const propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.shape({}),
    setUser: PropTypes.func.isRequired,
};

const defaultProps = {
    user: undefined,
};

const mapStateToProps = state => ({
    user: userSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setUser: params => dispatch(setUserAction(params)),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Auth extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(this.handleAuthStateChange);
    }

    handleAuthStateChange = (user) => {
        if (user) {
            this.props.setUser(pick(user, [
                'displayName', 'email', 'uid',
            ]));
            this.setState({ loggedIn: true });
            return;
        }

        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    render() {
        const { children } = this.props;
        const { loggedIn } = this.state;

        if (!loggedIn) {
            return null;
        }

        return React.Children.only(children);
    }
}
