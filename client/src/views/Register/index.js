import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import Request, { ApiPropType } from '#components/Request';
import { toFaramError } from '#rest';

import Faram, { requiredCondition } from '#rscg/Faram';
import NonFieldErrors from '#rsci/NonFieldErrors';
import TextInput from '#rsci/TextInput';
import AccentButton from '#rsca/Button/AccentButton';

import styles from './styles.scss';

const propTypes = {
    api: ApiPropType.isRequired,
    registerPending: PropTypes.bool,
};

const defaultProps = {
    registerPending: false,
};


@Request
export default class Register extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            redirectToLogin: false,
            faramValues: {},
            faramErrors: {},
        };

        this.schema = {
            fields: {
                firstName: [requiredCondition],
                lastName: [requiredCondition],
                username: [requiredCondition],
                password: [requiredCondition],
            },
        };
    }

    handleRegisterSuccess = () => {
        this.setState({
            redirectToLogin: true,
        });
    }

    handleRegisterFailure = (error) => {
        this.setState({
            faramErrors: toFaramError(error.errors),
        });
    }

    handleFaramSuccess = (values) => {
        this.props.api.post({
            key: 'users',
            body: values,
            onSuccess: this.handleRegisterSuccess,
            onFailure: this.handleRegisterFailure,
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
                Register
            </h1>
        </div>
    )

    renderForm = () => (
        <div className={styles.form}>
            <NonFieldErrors faramElement />
            <TextInput
                className={styles.formItem}
                faramElementName="firstName"
                label="First name"
            />
            <TextInput
                className={styles.formItem}
                faramElementName="lastName"
                label="Last name"
            />
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
                Register
            </AccentButton>
        </div>
    )

    render() {
        const Header = this.renderHeader;
        const Form = this.renderForm;

        const { registerPending } = this.props;

        if (this.state.redirectToLogin) {
            return (
                <Redirect to="/login/" />
            );
        }

        return (
            <Faram
                className={styles.register}
                onValidationSuccess={this.handleFaramSuccess}
                onValidationFailure={this.handleValidationFailure}
                onChange={this.handleFaramChange}
                schema={this.schema}
                value={this.state.faramValues}
                error={this.state.faramErrors}
                disabled={registerPending}
            >
                <Header />
                <Form />
            </Faram>
        );
    }
}
