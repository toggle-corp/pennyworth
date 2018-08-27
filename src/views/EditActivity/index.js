import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Faram, { requiredCondition } from '#rsci/Faram';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import DateInput from '#rsci/DateInput';
import Button from '#rsca/Button';
import AccentButton from '#rsca/Button/AccentButton';
import DangerButton from '#rsca/Button/DangerButton';
import ConfirmOnClick from '#components/ConfirmOnClick';

import { encodeDate } from '#rsu/common';
import { iconNames } from '#rsk';

import { categoryListSelector } from '#redux/categories';
import {
    activitiesSelector,
    addActivityAction,
    editActivityAction,
    removeActivityAction,
} from '#redux/activities';

import styles from './styles.scss';

const DangerConfirmButton = ConfirmOnClick(DangerButton);

const propTypes = {
    activityId: PropTypes.string,
    activities: PropTypes.objectOf(PropTypes.object),
    categories: PropTypes.arrayOf(PropTypes.object),
    history: PropTypes.shape({
        goBack: PropTypes.func,
        replace: PropTypes.func,
    }).isRequired,
    routeState: PropTypes.shape({ fromApp: PropTypes.bool }),
    addActivity: PropTypes.func.isRequired,
    editActivity: PropTypes.func.isRequired,
    deleteActivity: PropTypes.func.isRequired,
};

const defaultProps = {
    activityId: undefined,
    activities: {},
    categories: [],
    routeState: {},
};

const mapStateToProps = (state, props) => ({
    activityId: props.match.params.id,
    routeState: props.location.state,
    categories: categoryListSelector(state),
    activities: activitiesSelector(state),
});

const mapDispatchToProps = dispatch => ({
    addActivity: params => dispatch(addActivityAction(params)),
    editActivity: params => dispatch(editActivityAction(params)),
    deleteActivity: params => dispatch(removeActivityAction(params)),
});

const CategoryKeySelector = c => (c || {}).id;
const CategoryLabelSelector = c => (c || {}).title;

@connect(mapStateToProps, mapDispatchToProps)
export default class EditActivity extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        let initialData = {};
        if (props.activityId) {
            initialData = props.activities[props.activityId];
        }

        if (!initialData.date) {
            initialData.date = encodeDate(new Date());
        }

        this.initialData = initialData;
        this.state = {
            faramValues: initialData,
            faramErrors: {},
        };

        this.schema = {
            fields: {
                title: [requiredCondition],
                amount: [requiredCondition],
                date: [requiredCondition],
                category: [requiredCondition],
            },
        };
    }

    getTitle = () => 'Activity details'

    goBack = () => {
        if (this.props.routeState.fromApp) {
            this.props.history.goBack();
        } else {
            this.props.history.replace('/');
        }
    }

    handleFaramSuccess = (values) => {
        if (this.props.activityId) {
            this.props.editActivity({
                id: this.props.activityId,
                ...this.initialData,
                ...values,
            });
        } else {
            this.props.addActivity(values);
        }

        this.goBack();
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

    handleDelete = () => {
        if (!this.props.activityId) {
            return;
        }

        this.props.deleteActivity({
            id: this.props.activityId,
        });
        this.goBack();
    }

    renderHeader = () => (
        <div className={styles.header}>
            <div className={styles.left}>
                <Button
                    className={styles.backButton}
                    onClick={this.goBack}
                    iconName={iconNames.chevronLeft}
                    transparent
                />
                <h1>
                    {this.getTitle()}
                </h1>
            </div>
            <div className={styles.right}>
                {this.props.activityId && (
                    <DangerConfirmButton
                        onClick={this.handleDelete}
                        confirmationMessage="Are you sure you want to delete this activity?"
                        iconName={iconNames.delete}
                        transparent
                    />
                )}
                <AccentButton
                    type="submit"
                    iconName={iconNames.check}
                    transparent
                />
            </div>
        </div>
    )

    renderForm = () => (
        <Faram
            className={styles.form}
            onValidationSuccess={this.handleFaramSuccess}
            onValidationFailure={this.handleValidationFailure}
            onChange={this.handleFaramChange}
            schema={this.schema}
            value={this.state.faramValues}
            error={this.state.faramErrors}
        >
            <TextInput
                className={styles.formItem}
                faramElementName="title"
                label="Title"
            />
            <TextInput
                className={styles.formItem}
                faramElementName="amount"
                type="number"
                label="Amount"
            />
            <DateInput
                className={styles.formItem}
                faramElementName="date"
                label="Date"
            />
            <SelectInput
                className={styles.formItem}
                faramElementName="category"
                label="Category"
                options={this.props.categories}
                keySelector={CategoryKeySelector}
                labelSelector={CategoryLabelSelector}
            />
        </Faram>
    )

    render() {
        const Header = this.renderHeader;
        const Form = this.renderForm;

        return (
            <div className={styles.editActivity}>
                <Header />
                <Form />
            </div>
        );
    }
}
