import axios from 'axios'

export const getApartaments = () => async (dispatch, getState) => {
    const { search } = getState();
    const { price_from, price_to, rooms, page } = search;

    try {
        dispatch({ type: 'APARTAMENTS_PENDING' });
        dispatch({ type: 'SEARCH_PENDING' });

        const response = await axios.get(`${process.env.REACT_APP_API_GATEWAY}apartaments`, {
            params: { price_from, price_to, rooms, page }
        })

        dispatch({
            type: 'APARTAMENTS_FULFILLED',
            payload: response.data
        });

        dispatch({
            type: 'SEARCH_FULFILLED',
            payload: response.data
        });
    } catch(error) {
        dispatch({
            type: 'APARTAMENTS_REJECTED',
            payload: error,
        });

        dispatch({
            type: 'SEARCH_FULFILLED',
            payload: error
        });
    }

}