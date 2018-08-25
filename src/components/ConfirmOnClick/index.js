import PropTypes from 'prop-types';
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import AccentButton from '#rsca/Button/AccentButton';
import DangerButton from '#rsca/Button/DangerButton';

import SnackBar from '#components/SnackBar';
import styles from './styles.scss';

const propTypes = {
    onClick: PropTypes.func.isRequired,
    confirmationMessage: PropTypes.string.isRequired,
};

export default (WrappedComponent) => {
    class ConfirmComponent extends React.PureComponent {
        static propTypes = propTypes;

        constructor(props) {
            super(props);

            this.state = {
                showConfirm: false,
            };
        }

        handleModalShow = () => {
            this.setState({
                showConfirm: true,
            });
        }

        handleModalHide = () => {
            this.setState({
                showConfirm: false,
            });
        }

        handleOk = () => {
            const { onClick } = this.props;
            this.setState({
                showConfirm: false,
            }, () => { onClick(); });
        }

        renderConfirm = () => {
            const { showConfirm } = this.state;
            if (!showConfirm) {
                return null;
            }

            const { confirmationMessage } = this.props;

            return (
                <SnackBar className={styles.confirm}>
                    <div className={styles.message}>
                        { confirmationMessage }
                    </div>
                    <div className={styles.footer}>
                        <DangerButton
                            onClick={this.handleModalHide}
                            transparent
                        >
                            No
                        </DangerButton>
                        <AccentButton
                            onClick={this.handleOk}
                            transparent
                        >
                            Yes
                        </AccentButton>
                    </div>
                </SnackBar>
            );
        }

        render() {
            const {
                onClick, // eslint-disable-line no-unused-vars
                confirmationMessage, // eslint-disable-line no-unused-vars
                ...otherProps
            } = this.props;

            const buttonProps = {
                ...otherProps,
                onClick: this.handleModalShow,
            };
            const Confirm = this.renderConfirm;

            return (
                <React.Fragment>
                    <WrappedComponent {...buttonProps} />
                    <Confirm />
                </React.Fragment>
            );
        }
    }

    return hoistNonReactStatics(
        ConfirmComponent,
        WrappedComponent,
    );
};
