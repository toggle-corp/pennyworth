const defaultReducer = state => state;

export default (reducers, initialData) => (state = initialData, action) => {
    const reducer = reducers[action.type];
    if (reducer) {
        return reducer(state, action);
    }
    return defaultReducer(state, action);
};
