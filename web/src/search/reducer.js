const defaultState = {
    rooms_total: 8,
    rooms: 1,
    price_from: 0,
    price_to: 300,
    price_min: 0,
    price_max: 500,
    page: 1,
    loading: false
}

export const searchReducer = function (state = defaultState, action) {
    switch (action.type) {
        case "PRICE_FROM":
            return {
                ...state,
                price_from: Math.min(action.payload, state.price_to)
            };
        case "PRICE_TO":
            return {
                ...state,
                price_to: Math.max(action.payload, state.price_from)
            };
        case "COUNT_ROOMS":
            return {
                ...state,
                rooms: action.payload
            };
        case "PAGE":
            return {
                ...state,
                page: action.payload
            };
        case "SEARCH_PENDING":
            return {
                ...state,
                loading: true
            };
        case "SEARCH_FULFILLED":
            return {
                ...state,
                page: action.payload.page,
                loading: false
            };
        case "SEARCH_FULFILLED":
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        default:
            return state;
    }
};