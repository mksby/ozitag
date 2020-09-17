import moment from 'moment';

const defaultState = {
    apartaments: {
        total: null,
        page: null,
        pages: null,
        page_size: null,
        items: []
    },
    status: null,
    error: null
}

export const searchReducer = function (state = defaultState, action) {
    switch (action.type) {
        case 'APARTAMENTS_PENDING':
            return {
                ...state,
                status: 'loading',
                error: null
            };
        case 'APARTAMENTS_FULFILLED':
            return {
                ...state,
                apartaments: {
                    ...action.payload,
                    items: action.payload.items.map(i => ({
                        ...i,
                        description: (i.description || '').slice(0, 100) + ((i.description || '').length > 100 ? '...' : ''),
                        updatedAt: moment(i.updatedAt).startOf('hour').fromNow()
                    }))
                },
                status: 'succeed',
                error: null
            };
        case 'APARTAMENTS_REJECTED':
            return {
                ...state,
                status: 'failed',
                error: action.payload
            };
        default:
            return state;
    }
};