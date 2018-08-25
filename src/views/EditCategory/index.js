import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Faram, { requiredCondition } from '#rsci/Faram';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import Button from '#rsca/Button';
import AccentButton from '#rsca/Button/AccentButton';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';

import { iconNames } from '#rsk';

import {
    categoriesSelector,
    addCategoryAction,
    editCategoryAction,
    removeCategoryAction,
} from '#redux/categories';

import styles from './styles.scss';

const propTypes = {
    categoryId: PropTypes.string,
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
    categoryId: undefined,
    categories: {},
    routeState: {},
};

const mapStateToProps = (state, props) => ({
    categoryId: props.match.params.id,
    routeState: props.location.state,
    categories: categoriesSelector(state),
});

const mapDispatchToProps = dispatch => ({
    addCategory: params => dispatch(addCategoryAction(params)),
    editCategory: params => dispatch(editCategoryAction(params)),
    deleteCategory: params => dispatch(removeCategoryAction(params)),
});


const categoryFlowOptions = [
    { key: 'in', label: 'In' },
    { key: 'out', label: 'Out' },
];

@connect(mapStateToProps, mapDispatchToProps)
export default class EditCategory extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        let initialData = {};
        if (props.categoryId) {
            initialData = props.categories[props.categoryId];
        }

        this.state = {
            faramValues: initialData,
            faramErrors: {},
        };

        this.schema = {
            fields: {
                title: [requiredCondition],
                flow: [requiredCondition],
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
        if (this.props.categoryId) {
            this.props.editCategory({
                id: this.props.categoryId,
                ...values,
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
        if (!this.props.categoryId) {
            return;
        }

        this.props.deleteCategory({
            id: this.props.categoryId,
        });
        this.goBack();
    }

    renderHeader = () => (
        <div className={styles.header}>
            <Button
                className={styles.backButton}
                onClick={this.goBack}
                iconName={iconNames.chevronLeft}
                transparent
            />
            <h1>
                {this.getTitle()}
            </h1>
            <div className={styles.padding} />
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
            <SelectInput
                className={styles.formItem}
                faramElementName="flow"
                label="Flow"
                options={categoryFlowOptions}
            />
            <div className={styles.footer}>
                {!this.props.categoryId && (
                    <span />
                )}
                {this.props.categoryId && (
                    <DangerConfirmButton
                        onClick={this.handleDelete}
                        confirmationMessage="Are you sure you want to delete this category?"
                        transparent
                    >
                        Delete
                    </DangerConfirmButton>
                )}
                <AccentButton
                    type="submit"
                    transparent
                >
                    Save
                </AccentButton>
            </div>
        </Faram>
    )

    render() {
        const Header = this.renderHeader;
        const Form = this.renderForm;

        return (
            <div className={styles.editCategory}>
                <Header />
                <Form />
            </div>
        );
    }
}