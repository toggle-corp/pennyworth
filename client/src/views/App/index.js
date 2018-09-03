import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import PrivateRoute from '#rscg/PrivateRoute';
import ExclusivelyPublicRoute from '#rscg/ExclusivelyPublicRoute';

import { tokensSelector } from '#redux/auth';
import DbSync from '#components/DbSync';

import Login from '#views/Login';
import Register from '#views/Register';
import Home from '#views/Home';
import EditActivity from '#views/EditActivity';
import EditCategory from '#views/EditCategory';

const propTypes = {
    tokens: PropTypes.shape({ access: PropTypes.string }),
};

const defaultProps = {
    tokens: {},
};

const mapStateToProps = state => ({
    tokens: tokensSelector(state),
});


@connect(mapStateToProps)
export default class App extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const authenticated = !!this.props.tokens.access;

        return (
            <DbSync>
                <Router>
                    <Switch>
                        <ExclusivelyPublicRoute
                            path="/login"
                            component={Login}
                            authenticated={authenticated}
                            redirectLink="/"
                        />
                        <ExclusivelyPublicRoute
                            path="/register"
                            component={Register}
                            authenticated={authenticated}
                            redirectLink="/"
                        />
                        <PrivateRoute
                            path="/"
                            component={Home}
                            authenticated={authenticated}
                            exact
                        />
                        <PrivateRoute
                            path="/edit-activity/:key?"
                            component={EditActivity}
                            authenticated={authenticated}
                        />
                        <PrivateRoute
                            path="/edit-category/:key?"
                            component={EditCategory}
                            authenticated={authenticated}
                        />
                    </Switch>
                </Router>
            </DbSync>
        );
    }
}
