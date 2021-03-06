import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Faram, { requiredCondition } from '#rscg/Faram';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import Button from '#rsca/Button';
import AccentButton from '#rsca/Button/AccentButton';
import DangerButton from '#rsca/Button/DangerButton';
import ConfirmOnClick from '#components/ConfirmOnClick';

import { iconNames } from '#rsk';

import {
    categoriesSelector,
    addCategoryAction,
    editCategoryAction,
    removeCategoryAction,
} from '#redux/categories';

import styles from './styles.scss';


const DangerConfirmButton = ConfirmOnClick(DangerButton);

const propTypes = {
    categoryKey: PropTypes.string,
    categories: PropTypes.objectOf(PropTypes.object),
    history: PropTypes.shape({
        goBack: PropTypes.func,
        replace: PropTypes.func,
    }).isRequired,
    routeState: PropTypes.shape({ fromApp: PropTypes.bool }),
    addCategory: PropTypes.func.isRequired,
    editCategory: PropTypes.func.isRequired,
    deleteCategory: PropTypes.func.isRequired,
};

const defaultProps = {
    categoryKey: undefined,
    categories: {},
    routeState: {},
};

const mapStateToProps = (state, props) => ({
    categoryKey: props.match.params.key,
    routeState: props.location.state,
    categories: categoriesSelector(state),
});

const mapDispatchToProps = dispatch => ({
    addCategory: params => dispatch(addCategoryAction(params)),
    editCategory: params => dispatch(editCategoryAction(params)),
    deleteCategory: params => dispatch(removeCategoryAction(params)),
});


const categoryTypeOptions = [
    { key: 'income', label: 'Income' },
    { key: 'expense', label: 'Expense' },
];

@connect(mapStateToProps, mapDispatchToProps)
export default class EditCategory extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.initialData = {};
        if (props.categoryKey) {
            this.initialData = props.categories[props.categoryKey];
        }

        this.state = {
            faramValues: this.initialData,
            faramErrors: {},
        };

        this.schema = {
            fields: {
                title: [requiredCondition],
                activityType: [requiredCondition],
                plannedAmount: [],
            },
        };
    }

    getTitle = () => 'Category details'

    goBack = () => {
        if (this.props.routeState.fromApp) {
            this.props.history.goBack();
        } else {
            this.props.history.replace('/');
        }
    }

    handleFaramSuccess = (values) => {
        if (this.props.categoryKey) {
            this.props.editCategory({
                key: this.props.categoryKey,
                ...this.initialData,
                ...values,
                sync: false,
            });
        } else {
            this.props.addCategory(values);
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
        if (!this.props.categoryKey) {
            return;
        }

        this.props.deleteCategory({
            key: this.props.categoryKey,
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
                {this.props.categoryKey && (
                    <DangerConfirmButton
                        onClick={this.handleDelete}
                        confirmationMessage="Are you sure you want to delete this category?"
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
        <div className={styles.form}>
            <TextInput
                className={styles.formItem}
                faramElementName="title"
                label="Title"
            />
            <SelectInput
                className={styles.formItem}
                faramElementName="activityType"
                label="Type"
                options={categoryTypeOptions}
            />
            <TextInput
                className={styles.formItem}
                faramElementName="plannedAmount"
                label="Planned amount"
                type="number"
            />
        </div>
    )

    render() {
        const Header = this.renderHeader;
        const Form = this.renderForm;

        return (
            <Faram
                className={styles.editCategory}
                onValidationSuccess={this.handleFaramSuccess}
                onValidationFailure={this.handleValidationFailure}
                onChange={this.handleFaramChange}
                schema={this.schema}
                value={this.state.faramValues}
                error={this.state.faramErrors}
            >
                <Header />
                <Form />
            </Faram>
        );
    }
}
