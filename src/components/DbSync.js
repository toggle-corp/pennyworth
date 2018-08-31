import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { api, decodeAccessToken } from '#rest';
import Request, { ApiPropType } from '#components/Request';
import {
    tokensSelector,
    logoutAction,
    setUserAction,
    setTokensAction,
} from '#redux/auth';
import {
    allCategoryListSelector,
    editCategoryAction,
} from '#redux/categories';
import {
    allActivityListSelector,
    editActivityAction,
} from '#redux/activities';

const propTypes = {
    children: PropTypes.node.isRequired,
    api: ApiPropType.isRequired,

    tokens: PropTypes.shape({
        access: PropTypes.string,
        refresh: PropTypes.string,
    }),
    logout: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    setTokens: PropTypes.func.isRequired,

    categoryList: PropTypes.arrayOf(PropTypes.object).isRequired,
    editCategory: PropTypes.func.isRequired,

    activityList: PropTypes.arrayOf(PropTypes.object).isRequired,
    editActivity: PropTypes.func.isRequired,
};

const defaultProps = {
    tokens: {},
};

const mapStateToProps = state => ({
    tokens: tokensSelector(state),
    categoryList: allCategoryListSelector(state),
    activityList: allActivityListSelector(state),
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logoutAction()),
    setUser: params => dispatch(setUserAction(params)),
    setTokens: params => dispatch(setTokensAction(params)),

    editCategory: params => dispatch(editCategoryAction(params)),
    editActivity: params => dispatch(editActivityAction(params)),
});


@Request
@connect(mapStateToProps, mapDispatchToProps)
export default class DbSync extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    componentDidMount() {
        this.refreshToken();
        this.fetchCategories();
        this.fetchActivities();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tokens.access !== this.props.tokens.access) {
            this.syncAuth(nextProps.tokens.access);

            if (nextProps.tokens.access) {
                this.fetchCategories();
                this.fetchActivities();
                this.syncCategories(nextProps.categoryList);
                this.syncActivities(nextProps.activityList);
            }
        } else if (nextProps.categoryList !== this.props.categoryList) {
            this.syncCategories(nextProps.categoryList);
        } else if (nextProps.activityList !== this.props.activityList) {
            this.syncActivities(nextProps.activityList);
        }
    }

    componentWillUnmount() {
        if (this.tokenTimeout) {
            clearTimeout(this.tokenTimeout);
        }
    }

    syncAuth = (access) => {
        // 1. If no token, logout
        if (!access) {
            this.props.logout();
            return;
        }

        // 2. If access token, refresh user with that token
        const tokenInfo = decodeAccessToken(access);
        if (!tokenInfo.userId) {
            this.props.logout();
            return;
        }

        this.props.api.get({
            key: 'user',
            url: api(`users/${tokenInfo.userId}`),
            onSuccess: this.handleUserInfo,
        });
    }

    refreshToken = () => {
        const { refresh } = this.props.tokens;
        if (!refresh) {
            return;
        }

        this.props.api.post({
            key: 'refresh',
            url: api('token/refresh'),
            body: { refresh },
            onSuccess: this.handleTokenRefresh,
        });
        this.tokenTimeout = setTimeout(this.refreshToken, 1000 * 60);
    }

    handleUserInfo = (user) => {
        this.props.setUser(user);
    }

    handleTokenRefresh = (tokens) => {
        this.props.setTokens(tokens);
    }

    syncCategories = (categoryList) => {
        const { editCategory } = this.props;

        const categoriesToPut = categoryList.filter(c => !c.sync);
        categoriesToPut.forEach((category) => {
            this.props.api.post({
                key: `categories-${category.key}`,
                url: api('categories'),
                body: category,
                onSuccess: (response) => {
                    editCategory({
                        ...response,
                        sync: true,
                    });
                },
            });
        });
    }

    fetchCategories = () => {
        const { editCategory, categoryList } = this.props;
        const lastModified = Math.max(
            0,
            ...categoryList.map(c => c.modifiedAt),
        );
        this.props.api.get({
            key: 'newCategories',
            url: api('categories'),
            params: { modifiedSince: lastModified },
            onSuccess: (response) => {
                response.results.forEach((category) => {
                    editCategory({
                        ...category,
                        sync: true,
                    });
                });
            },
        });
    }

    syncActivities = (activityList) => {
        const { editActivity } = this.props;

        const activitiesToPut = activityList.filter(c => !c.sync);
        activitiesToPut.forEach((activity) => {
            this.props.api.post({
                key: `activities-${activity.key}`,
                url: api('activities'),
                body: activity,
                onSuccess: (response) => {
                    editActivity({
                        ...response,
                        sync: true,
                    });
                },
            });
        });
    }

    fetchActivities = () => {
        const { editActivity, activityList } = this.props;

        const lastModified = Math.max(
            0,
            ...activityList.map(c => c.modifiedAt),
        );
        this.props.api.get({
            key: 'newActivities',
            url: api('activities'),
            params: { modifiedSince: lastModified },
            onSuccess: (response) => {
                response.results.forEach((activity) => {
                    editActivity({
                        ...activity,
                        sync: true,
                    });
                });
            },
        });
    }

    render() {
        const { children } = this.props;
        return React.Children.only(children);
    }
}
