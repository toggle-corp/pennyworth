const defaultReducer = state => state;

export default (reducers, initialData) => (state = initialData, action) => {
    const reducer = reducers[action.type];
    if (reducer) {
        reducer(state, action);
    }
    return defaultReducer(state, action);
};
