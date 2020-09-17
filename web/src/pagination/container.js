import { connect } from 'react-redux';
import { Component } from './component';
import { getApartaments } from '../apartaments/actions';

const mapStateToProps = ({ apartaments }) => {
  return {
    status: apartaments.status,
    apartaments: apartaments.apartaments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangePage: page => {
      dispatch({ type: 'PAGE', payload: page });
      dispatch(getApartaments());
    }
  }
};

export const Container = connect(mapStateToProps, mapDispatchToProps)(Component);