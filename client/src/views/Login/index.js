import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Request, { ApiPropType } from '#components/Request';
import { toFaramError, api } from '#rest';

import Faram, { requiredCondition } from '#rscg/Faram';
import NonFieldErrors from '#rsci/NonFieldErrors';
import TextInput from '#rsci/TextInput';
import AccentButton from '#rsca/Button/AccentButton';

import { setTokensAction } from '#redux/auth';

import styles from './styles.scss';

const propTypes = {
    api: ApiPropType.isRequired,
    loginPending: PropTypes.bool,
    setTokens: PropTypes.func.isRequired,
};

const defaultProps = {
    loginPending: false,
};

const mapDispatchToProps = dispatch => ({
    setTokens: params => dispatch(setTokensAction(params)),
});


@Request
@connect(undefined, mapDispatchToProps)
export default class Login extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            faramValues: {},
            faramErrors: {},
        };

        this.schema = {
            fields: {
                username: [requiredCondition],
                password: [requiredCondition],
            },
        };
    }

    handleLoginSuccess = (response) => {
        this.props.setTokens(response);
    }

    handleLoginFailure = (error) => {
        this.setState({
            faramErrors: toFaramError(error.errors),
        });
    }

    handleFaramSuccess = (values) => {
        this.props.api.post({
            key: 'login',
            url: api('token'),
            body: values,
            onSuccess: this.handleLoginSuccess,
            onFailure: this.handleLoginFailure,
        });
    }

    handleValidationFailure = (faramErrors) => {
        this.setState({ faramErrors });
    };

    handleFaramChange = (values, errors) => {
        this.setState({
            faramValues: values,
            faramErrors: errors,
        });
    }

    renderHeader = () => (
        <div className={styles.header}>
            <h1>
                Login
            </h1>
        </div>
    )

    renderForm = () => (
        <div className={styles.form}>
            <NonFieldErrors faramElement />
            <TextInput
                className={styles.formItem}
                faramElementName="username"
                label="Username"
            />
            <TextInput
                className={styles.formItem}
                faramElementName="password"
                label="Password"
                type="password"
            />
            <AccentButton
                type="submit"
                transparent
            >
                Login
            </AccentButton>
        </div>
    )

    render() {
        const Header = this.renderHeader;
        const Form = this.renderForm;

        const { loginPending } = this.props;

        return (
            <Faram
                className={styles.login}
                onValidationSuccess={this.handleFaramSuccess}
                onValidationFailure={this.handleValidationFailure}
                onChange={this.handleFaramChange}
                schema={this.schema}
                value={this.state.faramValues}
                error={this.state.faramErrors}
                disabled={loginPending}
            >
                <Header />
                <Form />
                <div>
                    <p> Or </p>
                    <Link
                        to={{
                            pathname: '/register/',
                        }}
                    >
                        Register
                    </Link>
                </div>
            </Faram>
        );
    }
}
