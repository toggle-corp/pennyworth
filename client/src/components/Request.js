import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { connect } from 'react-redux';

import { isTruthy, randomString } from '#rsu/common';
import { tokensSelector } from '#redux/auth';
import { api } from '#rest';

const prepareUrlParams = params => Object.keys(params)
    .filter(k => isTruthy(params[k]))
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');

const noOp = () => null;

export const ApiPropType = PropTypes.shape({
    request: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
    post: PropTypes.func.isRequired,
});

const mapStateWithProps = state => ({
    tokens: tokensSelector(state),
});


export default (WrappedComponent) => {
    @connect(mapStateWithProps)
    class View extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {};
            this.unmounted = false;

            this.api = {
                request: this.request,
                get: this.get,
                post: this.post,
            };
        }

        componentWillUnmount() {
            this.unmounted = true;
        }

        request = ({
            key,
            url,
            params = {},
            onSuccess = noOp,
            onFailure = noOp,
            urlSuffix = '',
        }) => {
            const actualUrl = `${url || api(key)}${urlSuffix}`;
            const actualParams = { ...params };

            const { access } = this.props.tokens;
            if (access) {
                const { headers = {} } = params;
                actualParams.headers = {
                    ...headers,
                    Authorization: `Bearer ${access}`,
                };
            }

            const id = this.handlePreFetch(key, actualUrl, actualParams);

            fetch(actualUrl, actualParams)
                .then(this.handleResponse)
                .then((response) => {
                    if (!this.unmounted && this.state[`${key}Id`] === id) {
                        this.handleSuccess(key, actualUrl, response, onSuccess);
                    }
                })
                .catch((err) => {
                    if (!this.unmounted && this.state[`${key}Id`] === id) {
                        this.handleError(key, actualUrl, err, onFailure);
                    }
                });
        }

        post = ({ body, method = 'POST', ...args }) =>
            this.request({
                ...args,
                params: {
                    method,
                    body: JSON.stringify(body),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                },
            });

        get = ({ params, ...args }) =>
            this.request({
                ...args,
                urlSuffix: params ? `?${prepareUrlParams(params)}` : undefined,
                params: {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                },
            });

        handleResponse = response => response.text()
            .then((text) => {
                let json;
                if (text.length > 0) {
                    json = JSON.parse(text);
                }

                if (!response.ok) {
                    throw json;
                }

                return json;
            })

        handlePreFetch = (key, url, params) => {
            let message = 'Fetching\n';
            message += `Key: ${key} URL: ${url}\n`;
            console.log(message, params);

            const newId = randomString(16);
            this.setState({
                [`${key}Id`]: newId,
                [`${key}Pending`]: true,
                [`${key}Error`]: undefined,
                [key]: undefined,
            });

            return newId;
        }

        handleSuccess = (key, url, response, onSuccess) => {
            let message = 'Receiving \n';
            message += `Key: ${key} URL: ${url}\n`;
            console.log(message, response);

            this.setState({
                [`${key}Pending`]: false,
                [`${key}Error`]: undefined,
                [key]: response,
            }, () => {
                onSuccess(response, key);
            });
        }

        handleError = (key, url, err, onFailure) => {
            let message = 'Request failure\n';
            message += `Key: ${key} URL: ${url}\n`;
            console.error(message);
            console.error(err);

            this.setState({
                [`${key}Pending`]: false,
                [`${key}Error`]: err,
                [key]: undefined,
            }, () => {
                onFailure(err, key);
            });
        }

        render() {
            const {
                tokens, // eslint-disable-line no-unused-vars
                ...otherProps
            } = this.props;

            return (
                <WrappedComponent
                    api={this.api}
                    {...this.state}
                    {...otherProps}
                />
            );
        }
    }

    return hoistNonReactStatics(
        View,
        WrappedComponent,
    );
};
