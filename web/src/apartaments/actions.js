import axios from 'axios'

export const getApartaments = () => async (dispatch, getState) => {
    const { search } = getState();
    const { price_from, price_to, rooms, page } = search;

    try {
        dispatch({ type: 'APARTAMENTS_PENDING' });
        dispatch({ type: 'SEARCH_PENDING' });

        const response = await axios.get(`http://192.168.99.100:8888/api/apartaments?price_from=${price_from}&price_to=${price_to}&rooms=${rooms}&page=${page}`)

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
        })
    }

}