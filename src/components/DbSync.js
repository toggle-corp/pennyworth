import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import { connect } from 'react-redux';

import { userSelector } from '#redux/auth';
import {
    allCategoryListSelector,
    editCategoryAction,
    removeCategoryAction,
} from '#redux/categories';

import {
    allActivityListSelector,
    editActivityAction,
    removeActivityAction,
} from '#redux/activities';

const propTypes = {
    user: PropTypes.shape({ uid: PropTypes.string }).isRequired,
    children: PropTypes.node.isRequired,

    categoryList: PropTypes.arrayOf(PropTypes.object),
    editCategory: PropTypes.func.isRequired,
    removeCategory: PropTypes.func.isRequired,

    activityList: PropTypes.arrayOf(PropTypes.object),
    editActivity: PropTypes.func.isRequired,
    removeActivity: PropTypes.func.isRequired,
};

const defaultProps = {
    categoryList: [],
    activityList: [],
};

const mapStateToProps = state => ({
    categoryList: allCategoryListSelector(state),
    activityList: allActivityListSelector(state),
    user: userSelector(state),
});

const mapDispatchToProps = dispatch => ({
    editCategory: params => dispatch(editCategoryAction(params)),
    removeCategory: params => dispatch(removeCategoryAction(params)),
    editActivity: params => dispatch(editActivityAction(params)),
    removeActivity: params => dispatch(removeActivityAction(params)),
});


const removeKeys = (obj, keys) => {
    const newObj = { ...obj };
    keys.forEach(key => delete newObj[key]);
    return newObj;
};

@connect(mapStateToProps, mapDispatchToProps)
export default class DbSync extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);
        this.db = firebase.database();
    }

    componentDidMount() {
        this.createListeners();
        this.writeUnsaved({
            user: this.props.user,
            categoryList: this.props.categoryList,
            activityList: this.props.activityList,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.categoryList !== this.props.categoryList ||
            nextProps.activityList !== this.props.activityList
        ) {
            this.writeUnsaved({
                user: nextProps.user,
                categoryList: nextProps.categoryList,
                activityList: nextProps.activityList,
            });
        }
    }

    createListeners = () => {
        const {
            user,
            editCategory,
            removeCategory,
            editActivity,
            removeActivity,
        } = this.props;

        const path = `user-data/${user.uid}`;

        const categoriesPath = `${path}/categories`;
        const categoriesRef = this.db.ref(categoriesPath);

        categoriesRef.on('child_added', (data) => {
            editCategory({
                ...data.val(),
                sync: true,
            });
        });
        categoriesRef.on('child_changed', (data) => {
            editCategory({
                ...data.val(),
                sync: true,
            });
        });
        categoriesRef.on('child_removed', (data) => {
            removeCategory({
                id: data.key,
                sync: true,
            });
        });

        const activitiesPath = `${path}/activities`;
        const activitiesRef = this.db.ref(activitiesPath);

        activitiesRef.on('child_added', (data) => {
            editActivity({
                ...data.val(),
                sync: true,
            });
        });
        activitiesRef.on('child_changed', (data) => {
            editActivity({
                ...data.val(),
                sync: true,
            });
        });
        activitiesRef.on('child_removed', (data) => {
            removeActivity({
                id: data.key,
                sync: true,
            });
        });
    }

    writeUnsaved = ({ user, categoryList, activityList }) => {
        const path = `user-data/${user.uid}`;
        const localKeys = [
            'sync',
            'deleted',
        ];

        const categoriesPath = `${path}/categories`;
        categoryList.filter(c => !c.sync).forEach((category) => {
            const ref = this.db.ref(`${categoriesPath}/${category.id}`);

            if (category.deleted) {
                ref.remove();
                return;
            }

            const remoteCategory = removeKeys(category, localKeys);
            ref.set(remoteCategory);
        });

        const activitiesPath = `${path}/activities`;
        activityList.filter(a => !a.sync).forEach((activity) => {
            const ref = this.db.ref(`${activitiesPath}/${activity.id}`);

            if (activity.deleted) {
                ref.remove();
                return;
            }

            const remoteActivity = removeKeys(activity, localKeys);
            ref.set(remoteActivity);
        });
    }

    render() {
        const { children } = this.props;
        return React.Children.only(children);
    }
}
