import { connect } from 'react-redux';
import { Component } from './component';
import { getApartaments } from '../apartaments/actions';

const mapStateToProps = ({ search, apartaments }) => {
  return {
    price_from: search.price_from,
    price_to: search.price_to,
    price_min: search.price_min,
    price_max: search.price_max,
    rooms_total: search.rooms_total,
    rooms: search.rooms,
    loading: search.loading,
    status: apartaments.status,
    apartaments: apartaments.apartaments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangePriceFrom: event => dispatch({ type: 'PRICE_FROM', payload: event.target.value }),
    onChangePriceTo: event => dispatch({ type: 'PRICE_TO', payload: event.target.value }),
    onChangeCountRooms: event => dispatch({ type: 'COUNT_ROOMS', payload: event.target.value }),
    onSearch: () => dispatch(getApartaments())
  }
};

export const Container = connect(mapStateToProps, mapDispatchToProps)(Component);